import {isCurrent, isFuture, isPast} from './task.js';

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past'
};

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuture(point) || isCurrent(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPast(point) || isCurrent(point))
};

export {filter, FilterType};
