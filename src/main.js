import MenuView from './view/menu-view.js';
import PagePresenter from './presenter/page-presenter.js';
import PointsModel from './model/points_model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import {render} from './framework/render.js';
import NewPointButtonView from './view/new-point-button-view.js';
import {generatePoints, generateDestinations, generateOffers} from './mock/point.js';

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = document.querySelector('.page-header');

const pointsModel = new PointsModel();
pointsModel.init({
  points: generatePoints(),
  destinations: generateDestinations(),
  offers: generateOffers()
});
const filterModel = new FilterModel();

const pagePresenter = new PagePresenter({
  contentContainer: siteMainElement.querySelector('.trip-events'),
  pointsModel,
  filterModel
});
const filterPresenter = new FilterPresenter({
  filterContainer: siteHeaderElement.querySelector('.trip-controls__filters'),
  filterModel,
  pointsModel
});

const newPointButtonComponent = new NewPointButtonView();

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  pagePresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

render(new MenuView(), siteHeaderElement.querySelector('.trip-controls__navigation'));
filterPresenter.init();
render(newPointButtonComponent, siteHeaderElement.querySelector('.trip-main'));
newPointButtonComponent.setClickHandler(handleNewPointButtonClick);
pagePresenter.init();
