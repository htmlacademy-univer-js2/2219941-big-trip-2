import AbstractView from '../framework/view/abstract-view.js';

const SortType = {
  DAY: 'day',
  PRICE: 'price',
  TIME: 'time'
};

const createSortTemplate = (currentSortType) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            <div class="trip-sort__item  trip-sort__item--day">
              <input id="sort-day" class="trip-sort__input  visually-hidden ${currentSortType === SortType.DAY ? 'trip__sort-item--active' : ''}" type="radio"
              name="trip-sort" value="sort-day" data-sort-type="${SortType.DAY}"
              ${currentSortType === SortType.DAY ? 'checked' : ''}>
              <label class="trip-sort__btn" for="sort-day">Day</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--event">
              <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio"
              name="trip-sort" value="sort-event" disabled>
              <label class="trip-sort__btn" for="sort-event">Event</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--time">
              <input id="sort-time" class="trip-sort__input  visually-hidden ${currentSortType === SortType.TIME? 'trip__sort-item--active' : ''}" type="radio"
              name="trip-sort" value="sort-time" data-sort-type="${SortType.TIME}"
              ${currentSortType === SortType.TIME ? 'checked' : ''}>
              <label class="trip-sort__btn" for="sort-time">Time</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--price">
              <input id="sort-price" class="trip-sort__input  visually-hidden ${currentSortType === SortType.PRICE ? 'trip__sort-item--active' : ''}" type="radio"
              name="trip-sort" value="sort-price" data-sort-type="${SortType.PRICE}"
              ${currentSortType === SortType.PRICE ? 'checked' : ''}>
              <label class="trip-sort__btn" for="sort-price">Price</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--offer">
              <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio"
              name="trip-sort" value="sort-offer" disabled>
              <label class="trip-sort__btn" for="sort-offer">Offers</label>
            </div>
          </form>`
);

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor({currentSortType}) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  handleSortTypeChange = (callback) => {
    this._callback.changeSortType = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      evt.preventDefault();
      this._callback.changeSortType(evt.target.dataset.sortType);
    }
  };
}

export {SortType};
