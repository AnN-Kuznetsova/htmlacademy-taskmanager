import moment from "moment";


const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};

const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};

const isOverdueDate = (dueDate, date) => {
  return dueDate < date && !isOneDay(date, dueDate);
};

const isOneDay = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, `days`) === 0 && dateA.getDate() === dateB.getDate();
};

const getEnumPropertyKey = (Enumeration, value) => {
  let propertyKey = null;

  for (const twain of Object.entries(Enumeration)) {
    if (twain.includes(value)) {
      propertyKey = twain[0];
      break;
    }
  }

  return propertyKey;
};

const disableForm = (formElement, value = true) => {
  const formElements = formElement.elements;

  for (const element of formElements) {
    element.disabled = value;
  }
};


export {
  formatDate,
  formatTime,
  isRepeating,
  isOverdueDate,
  isOneDay,
  getEnumPropertyKey,
  disableForm,
};
