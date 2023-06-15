import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {POINT_TYPES} from '../const.js';
import {getDateTime} from '../utils/task.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';
import dayjs from 'dayjs';

const EMPTY_POINT = {
  basePrice: 0,
  dateFrom: dayjs(),
  dateTo: dayjs(new Date(new Date().setDate(new Date().getDate() + 1))),
  destination: 1,
  isFavorite: false,
  offers: [],
  type: 'taxi'
};

const createEventTypeItems = (chosenType, isDisabled) => {
  let result = '';
  POINT_TYPES.forEach((type) => {
    result += `<div class="event__type-item">
                 <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio"
                 name="event-type" value="${type.toLowerCase()}" ${type === chosenType ? 'checked' : ''}
                 ${isDisabled ? 'disabled' : ''}>
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

const createOffers = (offers, checkedOffers, isDisabled) => {
  let result = '';
  offers.forEach((offer) => {
    const {title, price, id} = offer;
    const isChecked = checkedOffers.includes(id) ? 'checked' : '';
    result += `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}"
        type="checkbox" name="event-offer-luggage" ${isChecked}
        ${isDisabled ? 'disabled' : ''}>
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

const createAddNewPointTemplate = (point, destinations, offersList) => {
  const {
    basePrice,
    dateFrom,
    dateTo,
    destination,
    offers,
    type,
    isDisabled,
    isSaving,
    isCancelling
  } = point;
  const allTypeOffers = offersList.find((offer) => offer.type === type);
  const destinationInfo = destinations.find((item) => item.id === destination);

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17"
                      src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1"
                    type="checkbox" ${isDisabled ? 'disabled' : ''}>

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>

                        ${createEventTypeItems(type, isDisabled)}

                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-${destination}">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-${destination}" type="text"
                    name="event-destination" value="${destinationInfo ? he.encode(destinationInfo.name) : ''}"
                    list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
                    <datalist id="destination-list-1">
                      ${createDestinationOptions(destinations)}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text"
                    name="event-start-time" value="${getDateTime(dateFrom)}" ${isDisabled ? 'disabled' : ''}>
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text"
                    name="event-end-time" value="${getDateTime(dateTo)}" ${isDisabled ? 'disabled' : ''}>
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="number"
                    name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
                    ${isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
                    ${isCancelling ? 'Cancelling...' : 'Cancel'}
                  </button>
                </header>
                <section class="event__details">
                ${allTypeOffers.offers.length !== 0 ? `
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                    <div class="event__available-offers">
                      ${createOffers(allTypeOffers.offers, offers, isDisabled)}
                    </div>
                  </section>` : ''}

                  ${destinationInfo ? `<section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destinations[destination].description}</p>
                    ${destinationInfo.pictures ? `
                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                        ${createPictures(destinationInfo.pictures)}
                      </div>
                    </div>` : ''}
                  </section>` : ''}
                </section>
              </form>
            </li>`;
};

export default class AddNewPointView extends AbstractStatefulView {
  #destination = null;
  #offers = null;
  #datepicker = null;

  constructor({point = EMPTY_POINT, destination, offers}) {
    super();
    this._state = AddNewPointView.parsePointToState(point);
    this.#destination = destination;
    this.#offers = offers;

    this._restoreHandlers();
  }

  get template() {
    return createAddNewPointTemplate(this._state, this.#destination, this.#offers);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  _restoreHandlers() {
    this.element.querySelector('.event__type-list')
      .addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__save-btn')
      .addEventListener('click',this.#submitClickHandler);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formCancelClickHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceChangeHandler);
    if (this.element.querySelector('.event__available-offers')) {
      this.element.querySelector('.event__available-offers')
        .addEventListener('change', this.#offersChangeHandler);
    }
    this.#handleDateFromChange();
    this.#handleDateToChange();
  }

  reset = (point) => {
    this.updateElement(AddNewPointView.parsePointToState(point));
  };

  setSubmitCallback = (callback) => {
    this._callback.submitNewPointClick = callback;
  };

  setCancelCallback = (callback) => {
    this._callback.cancelNewPointClick = callback;
  };

  #handleDateFromChange = () => {
    if (this._state.dateFrom) {
      this.#datepicker = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          dateFormat: 'd/m/y H:i',
          enableTime: true,
          defaultDate: this._state.dateFrom,
          maxDate: this._state.dateTo,
          onChange: this.#dateFromChangeHandler
        }
      );
    }
  };

  #handleDateToChange = () => {
    if (this._state.dateFrom) {
      this.#datepicker = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          dateFormat: 'd/m/y H:i',
          enableTime: true,
          defaultDate: this._state.dateTo,
          minDate: this._state.dateFrom,
          onChange: this.#dateToChangeHandler
        }
      );
    }
  };

  #formCancelClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.cancelNewPointClick(AddNewPointView.parseStateToPoint(this._state));
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: dayjs(userDate).toDate()
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: dayjs(userDate).toDate()
    });
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      ...this._state,
      type: evt.target.value,
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: this.#destination.find((dest) => evt.target.value === dest.name)?.id
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: Number(evt.target.value)
    });
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    const offerId = Number(evt.target.id.slice(-1));
    if (this._state.offers.includes(offerId)) {
      this._state.offers = this._state.offers.filter((id) => (
        id !== offerId));
    } else {
      this._state.offers.push(offerId);
    }
    this._setState({
      offers: this._state.offers
    });
  };

  #submitClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.submitNewPointClick(AddNewPointView.parseStateToPoint(this._state));
  };

  static parsePointToState = (point) => ({
    ...point,
    isDisabled: false,
    isSaving: false,
    isCancelling: false,
    dateTo: dayjs(point.dateTo).toDate(),
    dateFrom: dayjs(point.dateFrom).toDate()
  });

  static parseStateToPoint = (state) => {
    const point = {...state};
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isCancelling;
    return point;
  };
}
