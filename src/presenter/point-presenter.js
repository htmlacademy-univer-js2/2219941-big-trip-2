import {render, replace, remove} from '../framework/render.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

export default class PointPresenter {
  #pointsListContainer = null;
  #pointComponent = null;
  #editPointComponent = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #handleDataChange = null;
  #handleModeChange = null;

  #point = null;
  #destinations = null;
  #offers = null;
  #mode = Mode.DEFAULT;

  constructor({pointsListContainer, pointsModel, onDataChange, onModeChange, destinationsModel, offersModel}) {
    this.#pointsListContainer = pointsListContainer;
    this.#pointsModel = pointsModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init(point) {
    this.#point = point;
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView(point, this.#destinations, this.#offers);
    this.#pointComponent.handleRollDownButtonClick(this.#handleRollDownButtonClick);
    this.#pointComponent.handleFavoriteButtonClick(this.#handleFavoriteButtonClick);

    this.#editPointComponent = new EditPointView(point, this.#destinations, this.#offers);
    this.#editPointComponent.setSubmitCallback(this.#handleSubmitForm);
    this.#editPointComponent.setRollUpButtonCallback(this.#handleRollUpButtonClick);
    this.#editPointComponent.setDeleteCallback(this.#handleDeleteButtonClick);

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointComponent, this.#pointsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editPointComponent.reset(this.#point);
      this.#replaceEditToPoint();
    }
  }

  #replacePointToEdit = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #replaceEditToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.resetView();
    }
  };

  #handleRollDownButtonClick = () => {
    this.#replacePointToEdit();
  };

  #handleRollUpButtonClick = () => {
    this.resetView();
  };

  #handleSubmitForm = (point) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      point
    );
    this.#replaceEditToPoint();
  };

  #handleDeleteButtonClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #handleFavoriteButtonClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };
}

export {UpdateType, UserAction};
