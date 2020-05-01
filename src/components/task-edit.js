import AbstractSmartComponent from "./abstract-smart-component.js";
import {MONTH_NAMES, DAYS, COLORS} from "../const.js";
import {formatTime} from "../utils/common.js";

export default class TaskEdit extends AbstractSmartComponent {
  constructor(task) {
    super();

    this._task = task;
    this._submitCallback = null;

    this._subscribeOnEvents();
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


  //_onCardDateDeadlineToggle() {}

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
  }


  getTemplate() {
    const {color, description, dueDate, repeatingDays} = this._task;

    const isExpired = dueDate instanceof Date && dueDate < Date.now();
    const isDateShowing = !!dueDate;

    const date = isDateShowing ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
    const time = isDateShowing ? formatTime(dueDate) : ``;

    const isRepeatingTask = Object.values(repeatingDays).some(Boolean);
    const repeatClass = isRepeatingTask ? `card--repeat` : ``;
    const deadlineClass = isExpired ? `card--deadline` : ``;

    const repeatingDaysMarkup = this._createRepeatingDaysMarkup(DAYS, repeatingDays);
    const colorsMarkup = this._createColorsMarkup(COLORS, color);

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
              <button class="card__save" type="submit">save</button>
              <button class="card__delete" type="button">delete</button>
            </div>
          </div>
        </form>
      </article>`
    );
  }


  recoveryListeners() {
    this.setOnEditFormSubmit(this._submitCallback);
    this._subscribeOnEvents();
  }


  rerender() {
    super.rerender();
  }


  setOnEditFormSubmit(cb) {
    this.getElement().querySelector(`form`)
      .addEventListener(`submit`, cb);

    this._submitCallback = cb;
  }
}
