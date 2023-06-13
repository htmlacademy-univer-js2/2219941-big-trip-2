import PagePresenter from './presenter/page-presenter.js';
import MenuView from './view/menu-view.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';
import PointsModel from './model/points_model.js';
import PointsApiService from './api-service/points-api-service.js';
import DestinationsModel from './model/destinations-model.js';
import DestinationsApiService from './api-service/destinations-api-service.js';
import OffersModel from './model/offers-model.js';
import OffersApiService from './api-service/offers-api-service.js';
import {render} from './framework/render.js';

const AUTHORIZATION = 'Basic gs3df67Sq2Gjjr2';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = document.querySelector('.page-header');

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});

const destinationsModel = new DestinationsModel({
  destinationsApiService: new DestinationsApiService(END_POINT, AUTHORIZATION)
});

const offersModel = new OffersModel({
  offersApiService: new OffersApiService(END_POINT, AUTHORIZATION)
});

const filterModel = new FilterModel();

const pagePresenter = new PagePresenter({
  contentContainer: siteMainElement.querySelector('.trip-events'),
  pointsModel,
  filterModel,
  destinationsModel,
  offersModel
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
newPointButtonComponent.setClickHandler(handleNewPointButtonClick);

render(new MenuView(), siteHeaderElement.querySelector('.trip-controls__navigation'));
filterPresenter.init();
pagePresenter.init();
offersModel.init();
destinationsModel.init();
pointsModel.init()
  .finally(() => {
    render(newPointButtonComponent, siteHeaderElement.querySelector('.trip-main'));
  });

