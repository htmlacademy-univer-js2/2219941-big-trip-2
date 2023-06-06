import dayjs from 'dayjs';

const DATE_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'hh:mm';
const DATE_TIME_FORMAT = 'DD/MM/YY hh:mm';
const DAY_MINUTES_COUNT = 1440;
const HOUR_MINUTES_COUNT = 60;

const fixDateFormat = (date) => dayjs(date).format('MMM DD');
const getDate = (date) => dayjs(date).format(DATE_FORMAT);
const getTime = (date) => dayjs(date).format(TIME_FORMAT);
const getDateTime = (date) => dayjs(date).format(DATE_TIME_FORMAT);

const getDuration = (dateFrom, dateTo) => {
  const from = dayjs(dateFrom);
  const to = dayjs(dateTo);
  const difference = to.diff(from, 'minute');

  const days = Math.floor(difference / DAY_MINUTES_COUNT);
  const hours = Math.floor((difference - days * DAY_MINUTES_COUNT) / HOUR_MINUTES_COUNT);
  const minutes = Math.floor(difference - days * DAY_MINUTES_COUNT - hours * HOUR_MINUTES_COUNT);

  return `${days ? `${days}D` : ''} ${hours ? `${hours}H` : ''} ${minutes ? `${minutes}M` : ''}`;
};

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = (items) => items[getRandomInteger(0, items.length - 1)];

export {getRandomArrayElement, getRandomInteger, fixDateFormat, getTime, getDate, getDateTime, getDuration};
