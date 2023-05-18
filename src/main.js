import FilterView from './view/filter-view.js';
import TripPresenter from './presenter/presenter.js';
import {render} from './render.js';

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = document.querySelector('.page-header');
const tripPresenter = new TripPresenter({contentContainer: siteMainElement});

render(new FilterView(), siteHeaderElement.querySelector('.trip-controls__filters'));

tripPresenter.init();
