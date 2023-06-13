import Observable from '../framework/observable.js';
import {UpdateType} from '../presenter/point-presenter.js';

const EMPTY_DESTINATION = {
  id: 0,
  description: 'Nothing to say',
  name: 'Yekaterinburg',
  pictures: [
    {
      src: 'http://picsum.photos/300/200?r=0.0762563005163317',
      description: 'Chamonix parliament building'
    }
  ]
};

export default class DestinationsModel extends Observable {
  #destinationsApiService = null;
  #destinations = [];

  constructor({destinationsApiService}) {
    super();
    this.#destinationsApiService = destinationsApiService;
  }

  init = async () => {
    try {
      this.#destinations = await this.#destinationsApiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }
  };

  get destinations() {
    return this.#destinations;
  }
}

export {EMPTY_DESTINATION};
