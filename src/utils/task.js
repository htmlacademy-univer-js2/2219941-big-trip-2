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

const isFuture = (point) => dayjs().diff(point.dateFrom, 'hour') <= 0;
const isPast = (point) => dayjs().diff(point.dateTo, 'hour') > 0;
const isCurrent = (point) => isPast(point.dateFrom) && isFuture(point.dateTo);

const getSimpledDuration = (point) => dayjs(point.dateTo).diff(dayjs(point.dateFrom));

const getDateDifference = (pointFirst, pointSecond) => (
  dayjs(pointFirst.dateFrom).diff(dayjs(pointSecond.dateFrom))
);

export {fixDateFormat, getTime, getDate, getDateTime, getDuration,
  isFuture, isPast, isCurrent, getSimpledDuration, getDateDifference};
