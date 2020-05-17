import AbstractSmartComponent from "./abstract-smart-component.js";
import {MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH, DAYS, COLORS} from "../const.js";
import {disableForm, formatDate, formatTime, isRepeating, isOverdueDate} from "../utils/common.js";
import flatpickr from "flatpickr";
import {encode} from "he";

import "flatpickr/dist/flatpickr.min.css";


const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};


export default class TaskEdit extends AbstractSmartComponent {
  constructor(task) {
    super();

    this._task = task;

    this._color = task.color;
    this._description = task.description;
    this._dueDate = task.dueDate;
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);

    this._externalData = DefaultData;

    this._flatpickr = null;
    this._submitCallback = null;
    this._deleteButtonClickCallback = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }


  _isAllowableDescriptionLength(description) {
    const length = description.length;

    return length >= MIN_DESCRIPTION_LENGTH &&
      length <= MAX_DESCRIPTION_LENGTH;
  }


  _createColorsMarkup(colors, currentColor) {
    return (
      `<div class="card__colors-inner">
        <h3 class="card__colors-title">Color</h3>
        <div class="card__colors-wrap">

          ${colors
            .map((color, index) => {
              return (
                `<input
                  type="radio"
                  id="color-${color}-${index}"
                  class="card__color-input card__color-input--${color} visually-hidden"
                  name="color"
                  value="${color}"
                  ${currentColor === color ? `checked` : ``}
                />
                <label
                  for="color-${color}-${index}"
                  class="card__color card__color--${color}"
                  >${color}</label
                >`
              );
            })
            .join(`\n`)}

        </div>
      </div>`
    );
  }


  _createRepeatingDaysMarkup(days, repeatingDays) {
    return (
      `<fieldset class="card__repeat-days">
        <div class="card__repeat-days-inner">

        ${days
          .map((day, index) => {
            const isCheked = repeatingDays[day];
            return (
              `<input
                class="visually-hidden card__repeat-day-input"
                type="checkbox"
                id="repeat-${day}-${index}"
                name="repeat"
                value="${day}"
                ${isCheked ? `checked` : ``}
              />
              <label class="card__repeat-day" for="repeat-${day}-${index}"
                >${day}</label
              >`
            );
          })
          .join(`\n`)}

        </div>
      </fieldset>`
    );
  }


  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, () => {
        this._isDateShowing = !this._isDateShowing;
        this.rerender();
      });

    element.querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, () => {
        this._isRepeatingTask = !this._isRepeatingTask;

        this.rerender();
      });

    const repeatDays = element.querySelector(`.card__repeat-days`);
    if (repeatDays) {
      repeatDays.addEventListener(`change`, (evt) => {
        this._activeRepeatingDays[evt.target.value] = evt.target.checked;

        this.rerender();
      });
    }

    element.querySelector(`.card__colors-wrap`)
      .addEventListener(`change`, (evt) => {
        this._color = evt.target.value;
        this.rerender();
      });

    element.querySelector(`.card__text`)
      .addEventListener(`input`, (evt) => {
        this._description = evt.target.value;

        const saveButton = this.getElement().querySelector(`.card__save`);
        saveButton.disabled = !this._isAllowableDescriptionLength(this._description);
      });
  }


  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    if (this._isDateShowing) {
      const dateElement = this.getElement().querySelector(`.card__date`);
      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this._dueDate || `today`,
      });

      if (!this._dueDate) {
        this._dueDate = this._flatpickr.selectedDates;
      }

      this._flatpickr.config.onChange.push((selectedDates) => {
        this._dueDate = selectedDates;
      });
    }
  }


  getTemplate() {
    const [color, currentDescription, dueDate, isDateShowing, isRepeatingTask, activeRepeatingDays, externalData] =
      [this._color, this._description, this._dueDate, this._isDateShowing, this._isRepeatingTask, this._activeRepeatingDays, this._externalData];

    const description = encode(currentDescription);

    const isExpired = dueDate instanceof Date && isOverdueDate(dueDate, new Date());
    const isBlockSaveButton = (isDateShowing && isRepeatingTask) ||
      (isRepeatingTask && !isRepeating(activeRepeatingDays)) ||
      (isDateShowing && !dueDate) ||
      !this._isAllowableDescriptionLength(description);

    const date = (isDateShowing && dueDate) ? formatDate(dueDate) : ``;
    const time = (isDateShowing && dueDate) ? formatTime(dueDate) : ``;

    const repeatClass = isRepeatingTask ? `card--repeat` : ``;
    const deadlineClass = isExpired ? `card--deadline` : ``;

    const repeatingDaysMarkup = this._createRepeatingDaysMarkup(DAYS, activeRepeatingDays);
    const colorsMarkup = this._createColorsMarkup(COLORS, color);

    const deleteButtonText = externalData.deleteButtonText;
    const saveButtonText = externalData.saveButtonText;

    return (
      `<article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
        <form class="card__form" method="get">
          <div class="card__inner">
            <div class="card__color-bar">
              <svg class="card__color-bar-wave" width="100%" height="10">
                <use xlink:href="#wave"></use>
              </svg>
            </div>

            <div class="card__textarea-wrap">
              <label>
                <textarea
                  class="card__text"
                  placeholder="Start typing your text here..."
                  name="text"
                >${description}</textarea>
              </label>
            </div>

            <div class="card__settings">
              <div class="card__details">
                <div class="card__dates">
                  <button class="card__date-deadline-toggle" type="button">
                    date:
                    <span class="card__date-status">
                    ${isDateShowing ? `yes` : `no`}
                    </span>
                  </button>

      ${isDateShowing ?
        `<fieldset class="card__date-deadline">
                    <label class="card__input-deadline-wrap">
                      <input
                        class="card__date"
                        type="text"
                        placeholder=""
                        name="date"
                        value="${date} ${time}"
                      />
                    </label>
                  </fieldset>`
        : ``
      }

                  <button class="card__repeat-toggle" type="button">
                    repeat:
                    <span class="card__repeat-status">
                      ${isRepeatingTask ? `yes` : `no`}
                    </span>
                  </button>

                  ${isRepeatingTask ? repeatingDaysMarkup : ``}
                </div>
              </div>

              ${colorsMarkup}
            </div>

            <div class="card__status-btns">
              <button class="card__save" type="submit" ${isBlockSaveButton ? `disabled` : ``}>${saveButtonText}</button>
              <button class="card__delete" type="button">${deleteButtonText}</button>
            </div>
          </div>
        </form>
      </article>`
    );
  }


  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }


  recoveryListeners() {
    this.setOnEditFormSubmit(this._submitCallback);
    this.setOnDeleteButtonClick(this._deleteButtonClickCallback);
    this._subscribeOnEvents();
  }


  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }


  disableCardForm(value = true) {
    disableForm(this.getElement().querySelector(`.card__form`), value);
  }


  setOnEditFormSubmit(cb) {
    this.getElement().querySelector(`form`)
      .addEventListener(`submit`, cb);

    this._submitCallback = cb;
  }


  setOnDeleteButtonClick(cb) {
    this.getElement().querySelector(`.card__delete`)
      .addEventListener(`click`, cb);

    this._deleteButtonClickCallback = cb;
  }


  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }


  reset() {
    const task = this._task;

    this._color = task.color;
    this._description = task.description;
    this._dueDate = task.dueDate;
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);

    this.rerender();
  }


  getData() {
    const form = this.getElement().querySelector(`.card__form`);
    return new FormData(form);
  }
}
