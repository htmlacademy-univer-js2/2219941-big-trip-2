import {generatePoints, generateDestinations, generateOffers} from '../mock/point.js';

export default class PointsModel {
  #points = null;
  #destinations = null;
  #offers = null;

  constructor() {
    this.#points = Array.from(generatePoints());
    this.#destinations = Array.from(generateDestinations());
    this.#offers = Array.from(generateOffers());
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }
}
