import {getRandomArrayElement, getRandomInteger} from '../utils.js';

const POINTS_AMOUNT = 10;
const PICTURES_GENERATION = 11;

const POINT_TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant'
];
const DESTINATIONS = [
  'Saint-Petersburg',
  'Bangkok',
  'Tokyo',
  'London',
  'New York',
  'Singapore'
];
const DESCRIPTIONS = [
  'Cool travel',
  'You will love this place',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
  'Unforgettable experience for you. You will always remember this trip',
  'Authentic'
];
const PICTURE_DESCRIPTIONS = [
  'Море',
  'Отдых в горах',
  'Достопримечательности Тайланда'
];

const PicturesAmount = {MIN: 1, MAX: 3};
const OffersAmount = {MIN: 1, MAX: 4};
const Price = {MIN: 999, MAX: 6789};

const generatePicture = () => ({
  src: `http://picsum.photos/248/152?r=${getRandomInteger(1, PICTURES_GENERATION)}`,
  description: getRandomArrayElement(PICTURE_DESCRIPTIONS)
});

const generateDestination = (id) => ({
  id,
  description: getRandomArrayElement(DESCRIPTIONS),
  name: getRandomArrayElement(DESTINATIONS),
  pictures: Array.from({length: getRandomInteger(PicturesAmount.MIN, PicturesAmount.MAX)}, generatePicture)
});

const generateDestinations = () => Array.from({length: DESTINATIONS.length})
  .map((value, index) => generateDestination(index));

const generateOffer = (id, offerType) => ({
  id,
  title: `${offerType} offer`,
  price: getRandomInteger(Price.MIN, Price.MAX)
});

const generateOffersByType = (offerType) => ({
  type: offerType,
  offers: Array.from({length: getRandomInteger(OffersAmount.MIN, OffersAmount.MAX)})
    .map((value, index) => generateOffer(index + 1, offerType))
});

const generateOffers = () => Array.from({length: POINT_TYPES.length})
  .map((value, index) => generateOffersByType(POINT_TYPES[index]));

const offers = generateOffers();
const destinations = generateDestinations();

const generatePoint = (id) => {
  const offersPoint = getRandomArrayElement(offers);
  const offersIds = offersPoint.offers.map((offer) => offer.id);
  return {
    basePrice: getRandomInteger(Price.MIN, Price.MAX),
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: getRandomArrayElement(destinations).id,
    id,
    isFavourite: Boolean(getRandomInteger()),
    offers: Array.from({length: getRandomInteger(0, offersIds.length)})
      .map(() => offersIds[getRandomInteger(0, offersIds.length - 1)]),
    type: offersPoint.type
  };
};

const generatePoints = () => Array.from({length:POINTS_AMOUNT})
  .map((value, index) => generatePoint(index + 1));

export {generatePoints, generateDestinations, generateOffers};
