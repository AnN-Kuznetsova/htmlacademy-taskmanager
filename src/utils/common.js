import moment from "moment";


const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};

const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};


export {
  formatDate,
  formatTime,
};
