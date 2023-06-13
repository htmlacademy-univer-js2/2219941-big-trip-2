import Observable from '../framework/observable.js';
import {UpdateType} from '../presenter/point-presenter.js';
import {nanoid} from 'nanoid';
import dayjs from 'dayjs';

const EMPTY_POINT = {
  basePrice: 0,
  dateFrom: dayjs(),
  dateTo: dayjs('2023-12-31'),
  destination: 1,
  id: nanoid(),
  isFavorite: false,
  offers: [],
  type: 'ship'
};

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  init = async () => {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch(err) {
      this.#points = [];
    }
    this._notify(UpdateType.INIT);
  };

  get points() {
    return this.#points;
  }

  updatePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can not update non-existent point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1)
      ];

      this._notify(updateType, updatedPoint);
    } catch (err) {
      throw new Error('Can not update point');
    }
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

  #adaptToClient = (point) => {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: new Date(point['date_from']),
      dateTo: new Date(point['date_to']),
      isFavorite: point['is_favorite']
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  };
}

export {EMPTY_POINT};
