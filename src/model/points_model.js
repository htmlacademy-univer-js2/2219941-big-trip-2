import {generatePoints, generateDestinations, generateOffers} from '../mock/point.js';

export default class PointsModel {
  constructor() {
    this.points = Array.from(generatePoints());
    this.destinations = Array.from(generateDestinations());
    this.offers = Array.from(generateOffers());
  }

  getPoints() {
    return this.points;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }
}
