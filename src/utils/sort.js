import {getSimpledDuration, getDateDifference} from './task.js';

const sortTime = (dateFirst, dateSecond) => (
  getSimpledDuration(dateSecond) - getSimpledDuration(dateFirst)
);

const sortPrice = (pointFirst, pointSecond) => (
  pointSecond.basePrice - pointFirst.basePrice
);

const sortDay = (pointFirst, pointSecond) => (
  getDateDifference(pointFirst, pointSecond)
);

export {sortDay, sortTime, sortPrice};
