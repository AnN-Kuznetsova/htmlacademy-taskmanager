import AbstractComponent from "./abstract-component.js";

const FILTER_ID_PREFIX = `filter__`;


export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  _createFilterMarkup(filter) {
    const {name, count, isChecked} = filter;

    return (
      `<input
        type="radio"
        id="filter__${name}"
        class="filter__input visually-hidden"
        name="filter"
        ${isChecked ? `checked` : ``}
      />
      <label for="filter__${name}" class="filter__label">
        ${name} <span class="filter__${name}-count">${count}</span>
      </label>`
    );
  }

  _getFilterNameById(id) {
    return id.substring(FILTER_ID_PREFIX.length);
  }

  getTemplate() {
    const filtersMarkup = this._filters
      .map((it) => this._createFilterMarkup(it))
      .join(`\n`);

    return (
      `<section class="main__filter filter container">
        ${filtersMarkup}
      </section>`
    );
  }

  setOnFilterChange(cb) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = this._getFilterNameById(evt.target.id);
      cb(filterName);
    });
  }
}
