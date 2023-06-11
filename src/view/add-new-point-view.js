import AbstractView from '../framework/view/abstract-view.js';
import {POINT_TYPES} from '../mock/point';
import {getDateTime} from '../utils/task.js';

const createEventTypeItems = (chosenType) => {
  let result = '';
  POINT_TYPES.forEach((type) => {
    result += `<div class="event__type-item">
                 <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio"
                 name="event-type" value="${type.toLowerCase()}" ${type === chosenType ? 'checked' : ''}>
                 <label class="event__type-label  event__type-label--${type.toLowerCase()}"
                 for="event-type-${type.toLowerCase()}-1">${type}</label>
               </div>`;
  });
  return result;
};

const createDestinationOptions = (destinations) => {
  let result = '';
  destinations.forEach((dest) => {
    result += `<option value="${dest.name}"></option>`;
  });
  return result;
};

const createOffers = (offers) => {
  let result = '';
  offers.forEach((offer) => {
    const {title, price} = offer;
    result += `<div class="event__available-offers">
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}"
        type="checkbox" name="event-offer-luggage">
        <label class="event__offer-label" for="event-offer-${offer.id}">
            <span class="event__offer-title">${title}</span>
                &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
        </label>
      </div>`;
  });
  return result;
};

const createAddNewPointTemplate = (point, destinations) => {
  const {basePrice, dateFrom, dateTo, destination, offers, type} = point;

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17"
                      src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>

                        ${createEventTypeItems(type)}

                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text"
                    name="event-destination" value="${destinations[destination].name}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      ${createDestinationOptions()}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text"
                    name="event-start-time" value="${getDateTime(dateFrom)}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text"
                    name="event-end-time" value="${getDateTime(dateTo)}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text"
                    name="event-price" value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Cancel</button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                      ${createOffers(offers)}
                    </div>
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destinations[destination].description}</p>

                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                        <img class="event__photo" src="img/photos/1.jpg" alt="Event photo">
                        <img class="event__photo" src="img/photos/2.jpg" alt="Event photo">
                        <img class="event__photo" src="img/photos/3.jpg" alt="Event photo">
                        <img class="event__photo" src="img/photos/4.jpg" alt="Event photo">
                        <img class="event__photo" src="img/photos/5.jpg" alt="Event photo">
                      </div>
                    </div>
                  </section>
                </section>
              </form>
            </li>`;
};

export default class AddNewPointView extends AbstractView {
  #point = null;
  #destinations = null;

  constructor(point, destinations) {
    super();
    this.#point = point;
    this.#destinations = destinations;
  }

  get template() {
    return createAddNewPointTemplate(this.#point, this.#destinations);
  }
}
