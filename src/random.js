//  Функция нахождения случайного числа
const randomNumber = function (num) {
  return Math.floor(Math.random() * (num + 1));
};

//  Функция нахождения случайного числа в заданном диапазоне
const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

//  Функция выбора случачйного элемента массива
const getRandomArrayElement = function (array) {
  return array[randomNumber(array.length - 1)];
};

//  Функция взятия случайной даты в диапазоне
const getRandomDate = (minDateRange, maxDateRange) => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(minDateRange, maxDateRange);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

//  Функция генерирования случаного значения Boolean
const generateBoolean = () => {
  return !!(Math.random() > 0.5);
};


export {randomNumber, getRandomArrayElement, getRandomDate, generateBoolean};
