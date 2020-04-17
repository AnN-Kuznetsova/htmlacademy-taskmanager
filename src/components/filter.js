import {createElement} from "../utils.js";

export class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  createFilterMarkup(filter, isChecked) {
    const {title, count} = filter;

    return (
      `<input
        type="radio"
        id="filter__${title}"
        class="filter__input visually-hidden"
        name="filter"
        ${isChecked ? `checked` : ``}
      />
      <label for="filter__${title}" class="filter__label">
        ${title} <span class="filter__${title}-count">${count}</span>
      </label>`
    );
  }

  getTemplate() {
    const filtersMarkup = this._filters
      .map((it, i) => this.createFilterMarkup(it, i === 0))
      .join(`\n`);

    return (
      `<section class="main__filter filter container">
        ${filtersMarkup}
      </section>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
