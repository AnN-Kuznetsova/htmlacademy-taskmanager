const MONTH_NAMES = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatDate = (date) => {
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;
};

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 24);
  const minutes = castTimeFormat(date.getMinutes());
  return `${hours}:${minutes}`;
};


export {
  formatDate,
  formatTime,
};
