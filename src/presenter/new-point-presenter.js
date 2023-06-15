import {remove, render, RenderPosition} from '../framework/render.js';
import AddNewPointView from '../view/add-new-point-view.js';
import {UserAction, UpdateType} from './point-presenter.js';

export default class NewPointPresenter {
  #pointListContainer = null;

  #handleDataChange = null;
  #handleDestroy = null;

  #destinationsModel = null;
  #offersModel = null;

  #destinations = null;
  #offers = null;

  #newPointComponent = null;

  constructor({pointListContainer, onDataChange, destinationsModel, offersModel}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
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

  setSaving = () => {
    this.#newPointComponent.updateElement({
      isDisabled: true,
      isSaving: true
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#newPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };
    this.#newPointComponent.shake(resetFormState);
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );
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
