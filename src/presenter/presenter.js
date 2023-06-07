import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import PointListView from '../view/point-list-view.js';
import EditPointView from '../view/edit-point-view.js';
import NoPointView from '../view/no-point-view.js';
import {render} from '../render.js';

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
      this.#pointListComponent.element.replaceChild(editPointComponent.element, pointComponent.element);
    };

    const replaceEditToPoint = () => {
      this.#pointListComponent.element.replaceChild(pointComponent.element, editPointComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToEdit();
      document.addEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceEditToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceEditToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#pointListComponent.element);
  };
}
