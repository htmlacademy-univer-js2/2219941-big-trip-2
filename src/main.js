import FilterView from './view/filter-view.js';
import MenuView from './view/menu-view.js';
import TripPresenter from './presenter/presenter.js';
import PointsModel from './model/points_model.js';
import {render} from './framework/render.js';

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = document.querySelector('.page-header');
const pointsModel = new PointsModel();
const tripPresenter = new TripPresenter({
  contentContainer: siteMainElement.querySelector('.trip-events'),
  pointsModel: pointsModel});

render(new MenuView(), siteHeaderElement.querySelector('.trip-controls__navigation'));
render(new FilterView(), siteHeaderElement.querySelector('.trip-controls__filters'));
tripPresenter.init();
