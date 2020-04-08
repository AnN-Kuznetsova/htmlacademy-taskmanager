import {randomNumber} from "../util/random.js";

const FILTER_NAMES = [`all`, `overdue`, `today`, `favorites`, `repeating`, `archive`];
const FILTERED_VALUES_MAX_COUNT = 10;

const generateFilters = () => {
  return FILTER_NAMES.map((it) => {
    return {
      title: it,
      count: randomNumber(FILTERED_VALUES_MAX_COUNT)
    };
  });
};


export {generateFilters};
