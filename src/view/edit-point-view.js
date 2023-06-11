import {getDateTime} from '../utils/task.js';
import {POINT_TYPES} from '../mock/point.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {capitalizeFirstLetter} from '../utils/common.js';

const createOffers = (offers, checkedOffers) => {
  let result = '';
  offers.forEach((offer) => {
    const {title, price, id} = offer;
    const isChecked = checkedOffers.includes(id) ? 'checked' : '';
    result += `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}}"
        type="checkbox" name="event-offer-luggage" ${isChecked}>
        <label class="event__offer-label" for="event-offer-${id}">
            <span class="event__offer-title">${title}</span>
                &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
        </label>
      </div>`;
  });
  return result;
};

const createPictures = (pictures) => {
  let result = '';
  pictures.forEach((picture) => {
    result += `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
  });
  return result;
};

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

const createEditPointTemplate = (point, destinations, offersList) => {
  const {basePrice, dateFrom, dateTo, destination, offers, type} = point;
  const allTypeOffers = offersList.find((offer) => offer.type === type);

  return (`<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="${type} icon">
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
                    <label class="event__label  event__type-output" for="event-destination-${destination}">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-${destination}" type="text"
                    name="event-destination" value="${destinations[destination].name}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      ${createDestinationOptions(destinations)}
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
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price"
                    value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                        <div class="event__available-offers">
                            ${createOffers(allTypeOffers.offers, offers)}
                        </div>
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destinations[destination].description}</p>
                    <div class="event__photos-container">
                        <div class="event__photos-tape">
                            ${createPictures(destinations[destination].pictures)}
                        </div>
                    </div>
                  </section>
                </section>
              </form>
            </li>`);
};

export default class EditPointView extends AbstractStatefulView {
  #destination = null;
  #offers = null;

  constructor(point, destination, offers) {
    super();
    this._state = EditPointView.parsePointToState(point);
    this.#destination = destination;
    this.#offers = offers;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#destination, this.#offers);
  }

  _restoreHandlers() {
    this.handleSubmitForm();
    this.handleRollUpButtonClick();
    this.handleDestinationChange();
    this.handleTypeChange();
    this.handleOffersChange();
  }

  reset = (point) => {
    this.updateElement(EditPointView.parsePointToState(point));
  };

  handleTypeChange = (callback) => {
    this._callback.typeChange = callback;
    this.element.querySelector('.event__type-input')
      .addEventListener('change', this.#pointTypeChangeHandler);
  };

  handleDestinationChange = (callback) => {
    this._callback.destinationChange = callback;
    this.element.querySelector('.event__input--destination')
      .addEventListener('input', this.#destinationChangeHandler);
  };

  handleOffersChange = (callback) => {
    this._callback.offersChange = callback;
    this.element.querySelector('.event__available-offers')
      .addEventListener('change', this.#offersChangeHandler);
  };

  handleRollUpButtonClick = (callback) => {
    this._callback.rollupButtonClick = callback;
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupButtonClickHandler);
  };

  handleSubmitForm = (callback) => {
    this._callback.submitClick = callback;
    this.element.querySelector('.event__save-btn')
      .addEventListener('submit',this.#submitClickHandler);
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: capitalizeFirstLetter(evt.target.value),
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: this.#destination.find((dest) => evt.target.value === dest.name).id
    });
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    if (this._state.offers.includes(evt.target.id.slice(-1))) {
      this._state.offers = this._state.offers.filter((id) => (
        id !== evt.target.id.slice(-1)));
    } else {
      this._state.offers.push(evt.target.id.slice(-1));
    }
    this.updateElement({
      offers: this._state.offers
    });
  };

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.rollupButtonClick();
  };

  #submitClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.submitClick(this._state);
  };

  static parsePointToState = (point) => ({...point});

  static parseStateToPoint = (state) => ({...state});
}
