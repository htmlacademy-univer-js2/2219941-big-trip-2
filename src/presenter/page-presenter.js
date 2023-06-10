import SortView, {SortType} from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import {render, RenderPosition} from '../framework/render.js';
import {updateItem} from '../utils/common.js';
import {sortTime, sortPrice, sortDay} from '../utils/sort.js';

export default class PagePresenter {
  #contentContainer = null;
  #pointsModel = null;
  #points = [];

  #pointsListComponent = new PointListView();
  #noPointComponent = new NoPointView();
  #sortComponent = null;

  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;
  #sourcedPoints = [];

  constructor({contentContainer, pointsModel}) {
    this.#contentContainer = contentContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#sourcedPoints = [...this.#pointsModel.points];

    this.#renderPage();
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoints) => {
    this.#points = updateItem(this.#points, updatedPoints);
    this.#sourcedPoints = updateItem(this.#sourcedPoints, updatedPoints);
    this.#pointPresenter.get(updatedPoints.id).init(updatedPoints);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);

    this.#clearPointsList();
    this.#renderPointsList();
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.TIME:
        this.#points.sort(sortTime);
        break;
      case SortType.PRICE:
        this.#points.sort(sortPrice);
        break;
      default:
        this.#points.sort(sortDay);
    }

    this.#currentSortType = sortType;
  };

  #renderSort = () => {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#contentContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#pointsListComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = () => {
    this.#points.forEach((point) => this.#renderPoint(point));
  };

  #renderNoPoints = () => {
    render(this.#noPointComponent, this.#contentContainer, RenderPosition.AFTERBEGIN);
  };

  #clearPointsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderPointsList = () => {
    render(this.#pointsListComponent, this.#contentContainer);
    this.#renderPoints(this.#points);
  };

  #renderPage = () => {
    if (this.#points.length === 0) {
      this.#renderNoPoints();
    }
    else {
      this.#renderSort();
      this.#renderPointsList();
    }
  };


}
