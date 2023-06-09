import {filter} from '../utils/filter.js';

const generateFilter = (points) => (
  Object.entries(filter).map(
    ([filterName, filterTask]) => ({
      name: filterName,
      count: filterTask(points).length,
    }),
  )
);

export {generateFilter};
