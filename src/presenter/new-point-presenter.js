import {remove, render, RenderPosition} from '../framework/render.js';
import AddNewPointView from '../view/add-new-point-view.js';
import {nanoid} from 'nanoid';
import {UserAction, UpdateType} from './point-presenter.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #pointsModel = null;
  #destinations = null;
  #offers = null;

  #newPointComponent = null;


  constructor({pointListContainer, onDataChange, pointsModel}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#pointsModel = pointsModel;
  }

  init = (destroyHandler) => {
    this.#handleDestroy = destroyHandler;

    if (this.#newPointComponent !== null) {
      return;
    }
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offers = [...this.#pointsModel.offers];

    this.#newPointComponent = new AddNewPointView({
      destination: this.#destinations,
      offers: this.#offers
    });
    this.#newPointComponent.handleFormSubmit(this.#handleFormSubmit);
    this.#newPointComponent.handleCancelButtonClick(this.#handleCancelClick);

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
