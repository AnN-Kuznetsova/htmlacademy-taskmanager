import AbstractComponent from "./abstract-component.js";
import {formatDate, formatTime, isOverdueDate} from "../utils/common.js";

export default class Task extends AbstractComponent {
  constructor(task) {
    super();

    this._task = task;
  }


  _createButtonMarkup(name, isActive = true) {
    return (
      `<button type="button"
        class="card__btn card__btn--${name} ${isActive ? `` : `card__btn--disabled`}">
        ${name}
      </button>`
    );
  }


  getTemplate() {
    const {color, description, dueDate, repeatingDays, isArchive, isFavorite} = this._task;

    const isExpired = dueDate instanceof Date && isOverdueDate(dueDate, new Date());
    const isDateShowing = !!dueDate;

    const date = isDateShowing ? formatDate(dueDate) : ``;
    const time = isDateShowing ? formatTime(dueDate) : ``;


    const editButton = this._createButtonMarkup(`edit`);
    const arсhiveButton = this._createButtonMarkup(`arсhive`, !isArchive);
    const favoritesButton = this._createButtonMarkup(`favorites`, !isFavorite);

    const repeatClass = Object.values(repeatingDays).some(Boolean) ? `card--repeat` : ``;
    const deadlineClass = isExpired ? `card--deadline` : ``;

    return (
      `<article class="card card--${color} ${repeatClass} ${deadlineClass}">
        <div class="card__form">
          <div class="card__inner">
            <div class="card__control">
              ${editButton}
              ${arсhiveButton}
              ${favoritesButton}
            </div>

            <div class="card__color-bar">
              <svg class="card__color-bar-wave" width="100%" height="10">
                <use xlink:href="#wave"></use>
              </svg>
            </div>

            <div class="card__textarea-wrap">
              <p class="card__text">${description}</p>
            </div>

            <div class="card__settings">
              <div class="card__details">
                <div class="card__dates">
                  <div class="card__date-deadline">
                    <p class="card__input-deadline-wrap">
                      <span class="card__date">${date}</span>
                      <span class="card__time">${time}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>`
    );
  }


  setOnEditButtonClick(cb) {
    this.getElement().querySelector(`.card__btn--edit`)
      .addEventListener(`click`, cb);
  }


  setOnArchiveButtonClick(cb) {
    this.getElement().querySelector(`.card__btn--arсhive`)
      .addEventListener(`click`, cb);
  }


  setOnFavoritesButtonClick(cb) {
    this.getElement().querySelector(`.card__btn--favorites`)
      .addEventListener(`click`, cb);
  }
}
