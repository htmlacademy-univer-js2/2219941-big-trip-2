import Observable from '../framework/observable.js';
import {nanoid} from 'nanoid';
import dayjs from 'dayjs';

const EMPTY_POINT = {
  basePrice: 0,
  dateFrom: dayjs(),
  dateTo: dayjs('2023-12-31'),
  destination: 0,
  id: nanoid(),
  isFavorite: false,
  offers: [],
  type: 'Ship'
};

export default class PointsModel extends Observable {
  #points = null;
  #destinations = null;
  #offers = null;

  init = ({points, destinations, offers}) => {
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  };

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  updatePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can not update non-existent point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, update);
  };

  addPoint = (updateType, update) => {
    this.#points = [
      update,
      ...this.#points
    ];

    this._notify(updateType, update);
  };

  deletePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can not delete non-existent point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType);
  };
}

export {EMPTY_POINT};
