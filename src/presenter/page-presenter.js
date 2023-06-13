import SortView, {SortType} from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import NoPointView from '../view/no-point-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter, {UpdateType, UserAction} from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import {remove, render, RenderPosition} from '../framework/render.js';
import {sortTime, sortPrice, sortDay} from '../utils/sort.js';
import {filter, FilterType} from '../utils/filter.js';

export default class PagePresenter {
  #contentContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #pointsListComponent = new PointListView();
  #loadingComponent = new LoadingView();
  #noPointComponent = null;
  #sortComponent = null;

  #pointPresenter = new Map();
  #newPointPresenter = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  constructor({contentContainer, pointsModel, filterModel, destinationsModel, offersModel}) {
    this.#contentContainer = contentContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointsListComponent.element,
      onDataChange: this.#handleViewAction,
      pointsModel: this.#pointsModel,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderPage();
  }

  get points() {
    this.#filterType = this.#filterModel.filter.split('\n')[0];
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortDay);
      case SortType.TIME:
        return filteredPoints.sort(sortTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortPrice);
    }

    return filteredPoints;
  }

  createPoint = (destroyHandler) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(destroyHandler);
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPage();
        this.#renderPage();
        break;
      case UpdateType.MAJOR:
        this.#clearPage({
          resetSortType: true
        });
        this.#renderPage();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        remove(this.#noPointComponent);
        this.#renderPage();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPage();
    this.#renderPage();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType
    });
    this.#sortComponent.handleSortTypeChange(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#contentContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#pointsListComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#contentContainer);
  };

  #renderNoPoints = () => {
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType
    });
    render(this.#noPointComponent, this.#contentContainer);
  };

  #clearPage = ({resetSortType = false} = {}) => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach(((presenter) => presenter.destroy()));
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderPage = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    if (this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }
    this.#renderSort();
    render(this.#pointsListComponent, this.#contentContainer);
    this.#renderPoints(this.points);
  };
}
