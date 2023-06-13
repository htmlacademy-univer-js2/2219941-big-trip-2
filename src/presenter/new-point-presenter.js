import {remove, render, RenderPosition} from '../framework/render.js';
import AddNewPointView from '../view/add-new-point-view.js';
import {nanoid} from 'nanoid';
import {UserAction, UpdateType} from './point-presenter.js';
import {EMPTY_POINT} from '../model/points_model.js';

export default class NewPointPresenter {
  #pointListContainer = null;

  #handleDataChange = null;
  #handleDestroy = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #destinations = null;
  #offers = null;

  #newPointComponent = null;

  constructor({pointListContainer, onDataChange, pointsModel, destinationsModel, offersModel}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init = (destroyHandler) => {
    this.#handleDestroy = destroyHandler;

    if (this.#newPointComponent !== null) {
      return;
    }
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#newPointComponent = new AddNewPointView({
      point: EMPTY_POINT,
      destination: this.#destinations,
      offers: this.#offers
    });
    this.#newPointComponent.setSubmitCallback(this.#handleFormSubmit);
    this.#newPointComponent.setCancelCallback(this.#handleCancelClick);

    render(this.#newPointComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#newPointComponent === null) {
      return;
    }
    this.#handleDestroy();

    remove(this.#newPointComponent);
    this.#newPointComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point}
    );
    this.destroy();
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
