import {fixDateFormat, getDate, getTime, getDuration} from '../utils/task.js';
import AbstractView from '../framework/view/abstract-view.js';
import he from 'he';

const createOffers = (offers, checkedOffers) => {
  let result = '';
  offers.forEach((offer) => {
    const {id, title, price} = offer;
    if (checkedOffers.includes(id)) {
      result += `<li class="event__offer">
                   <span class="event__offer-title">${title}</span>
                     &plus;&euro;&nbsp;
                   <span class="event__offer-price">${price}</span>
                 </li>`;
    }
  });
  return result;
};

const createPointTemplate = (point, destinations, offersList) => {
  const {basePrice, dateFrom, dateTo, destination, isFavourite, offers, type} = point;
  const allTypeOffers = offersList.find((offer) => offer.type === type);
  const duration = getDuration(dateFrom, dateTo);
  const startDate = dateFrom ? fixDateFormat(dateFrom) : '';
  const endDate = dateTo ? fixDateFormat(dateTo) : '';
  const favouriteClass = isFavourite ? 'event__favorite-btn--active' : '';
  const destinationInfo = destinations.find((item) => item.id === destination);

  return (
    `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${getDate(dateFrom)}">${startDate}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="${type} icon">
                </div>
                <h3 class="event__title">${type} ${destinationInfo ? he.encode(destinationInfo.name) : ''}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${dateFrom}">
                        ${(startDate === endDate) ? getTime(dateFrom) : startDate}
                    </time>
                    &mdash;
                    <time class="event__end-time" datetime="${dateTo}">
                        ${(startDate === endDate) ? getTime(dateTo) : endDate}
                    </time>
                  </p>
                  <p class="event__duration">${duration}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                ${allTypeOffers ? `
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  ${createOffers(allTypeOffers.offers, offers)}
                </ul>` : ''}
                <button class="event__favorite-btn ${favouriteClass}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`);
};

export default class PointView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;

  constructor(point, destination, offers) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
  }

  get template() {
    return createPointTemplate(this.#point, this.#destination, this.#offers);
  }

  handleRollDownButtonClick = (callback) => {
    this._callback.rollupButtonClick = callback;
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupButtonClickHandler);
  };

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.rollupButtonClick();
  };

  handleFavoriteButtonClick = (callback) => {
    this._callback.favoriteButtonClick = callback;
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteButtonClickHandler);
  };

  #favoriteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteButtonClick();
  };
}
