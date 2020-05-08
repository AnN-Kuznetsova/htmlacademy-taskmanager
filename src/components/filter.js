import AbstractComponent from "./abstract-component.js";

const FILTER_ID_PREFIX = `filter__`;


export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  _createFilterMarkup(filter, isChecked) {
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

  _getFilterNameById(id) {
    return id.substring(FILTER_ID_PREFIX.length);
  }

  getTemplate() {
    const filtersMarkup = this._filters
      .map((it) => this._createFilterMarkup(it, it.isChecked))
      .join(`\n`);

    return (
      `<section class="main__filter filter container">
        ${filtersMarkup}
      </section>`
    );
  }

  setFilterChangeHandler(cb) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = this._getFilterNameById(evt.target.id);
      cb(filterName);
    });
  }
}
