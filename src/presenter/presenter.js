import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import PointListView from '../view/point-list-view.js';
import EditPointView from '../view/edit-point-view.js';
import NoPointView from '../view/no-point-view.js';
import {render, replace} from '../framework/render.js';

export default class TripPresenter {
  #contentContainer = null;
  #pointListComponent = null;
  #pointsModel = null;
  #points = [];
  #destinations = [];
  #offers = [];

  constructor({contentContainer, pointsModel}) {
    this.#contentContainer = contentContainer;
    this.#pointListComponent = new PointListView();
    this.#pointsModel = pointsModel;
  }

  init () {
    this.#points = [...this.#pointsModel.points];
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offers = [...this.#pointsModel.offers];

    if (this.#points.length === 0) {
      render(new NoPointView(), this.#contentContainer);
    }
    else {
      render(new SortView(), this.#contentContainer);
      render(this.#pointListComponent, this.#contentContainer);
      for (const point of this.#points) {
        this.#renderPoints(point);
      }
    }
  }

  #renderPoints = (point) => {
    const pointComponent = new PointView(point, this.#destinations, this.#offers);
    const editPointComponent = new EditPointView(this.#points[0], this.#destinations, this.#offers);

    const replacePointToEdit = () => {
      replace(editPointComponent, pointComponent);
    };

    const replaceEditToPoint = () => {
      replace(pointComponent, editPointComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.handleRollupButtonClick(() => {
      replacePointToEdit();
      document.addEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.handleRollupButtonClick(() => {
      replaceEditToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.handleSubmitForm(() => {
      replaceEditToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#pointListComponent.element);
  };
}
