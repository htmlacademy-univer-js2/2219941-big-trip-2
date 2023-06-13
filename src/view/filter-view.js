import AbstractView from '../framework/view/abstract-view.js';
import {capitalizeFirstLetter} from '../utils/common.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {name, count, type} = filter;
  return (
    `<div class="trip-filters__filter">
         <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden"
         type="radio" name="trip-filter" value="${type}"
         ${type === currentFilterType ? 'checked' : ''} ${count === 0 ? 'disabled' : ''}>
         <label class="trip-filters__filter-label" for="filter-${name}">
             ${capitalizeFirstLetter(name)}
         </label>
     </div>`
  );
};

const createFilterTemplate = (filters, currentFilterType) => {
  let filtersTemplate = '';
  filters.forEach((filter) => {
    filtersTemplate += createFilterItemTemplate(filter, currentFilterType);
  });

  return (
    `<form class="trip-filters" action="#" method="get">
        ${filtersTemplate}
        <button class="visually-hidden" type="submit">Accept filter</button>
     </form>`);
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor({filters, currentFilterType}) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  handleFilterTypeChange = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  };

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  };
}
