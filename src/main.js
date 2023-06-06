import FilterView from './view/filter-view.js';
import TripPresenter from './presenter/presenter.js';
import PointsModel from './model/points_model.js';
import {render} from './render.js';

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = document.querySelector('.page-header');
const pointsModel = new PointsModel();
const tripPresenter = new TripPresenter({
  contentContainer: siteMainElement,
  pointsModel: pointsModel});

render(new FilterView(), siteHeaderElement.querySelector('.trip-controls__filters'));

tripPresenter.init();
