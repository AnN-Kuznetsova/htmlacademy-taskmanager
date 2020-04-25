import {COLORS} from "../const.js";
import {getRandomArrayElement, getRandomDate, generateBoolean} from "../utils/random.js";

const MIN_DATE_RANGE = 0;
const MAX_DATE_RANGE = 8;

let index = 0;

const DESCRIPTION_ITEMS = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`,
  `Помыть посуду`,
  `Покормить кота`
];

const DEFAULT_REPEATING_DAYS = {
  "mo": false,
  "tu": false,
  "we": false,
  "th": false,
  "fr": false,
  "sa": false,
  "su": false,
};

const generateRepeatingDays = () => {
  return Object.assign({}, DEFAULT_REPEATING_DAYS, {
    "mo": generateBoolean()
  });
};

const generateTask = () => {
  const dueDate = generateBoolean() ? getRandomDate(MIN_DATE_RANGE, MAX_DATE_RANGE) : null;

  return {
    description: `${++index}  ${getRandomArrayElement(DESCRIPTION_ITEMS)}`,
    dueDate,
    repeatingDays: dueDate ? DEFAULT_REPEATING_DAYS : generateRepeatingDays(),
    color: getRandomArrayElement(COLORS),
    isArchive: generateBoolean(),
    isFavorite: generateBoolean()
  };
};

const generateTasks = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTask);
};


export {generateTask, generateTasks};
