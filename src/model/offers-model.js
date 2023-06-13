import Observable from '../framework/observable.js';

const EMPTY_OFFER = {
  id: 0,
  title: 'Cool offer',
  price: 77
};

export default class OffersModel extends Observable {
  #offersApiService = null;
  #offers = [];

  constructor({offersApiService}) {
    super();
    this.#offersApiService = offersApiService;
  }

  init = async () => {
    try {
      this.#offers = await this.#offersApiService.offers;
    } catch(err) {
      this.#offers = [];
    }
  };

  get offers() {
    return this.#offers;
  }
}

export {EMPTY_OFFER};
