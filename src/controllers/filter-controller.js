import FilterComponent from "../components/filter.js";
import {FilterType} from "../const.js";
import {render, replace, RenderPosition} from "../utils/render.js";
import {getTasksByFilter} from "../utils/filter.js";

export default class FilterController {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;
    this._filterElements = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onTasksModelFilterChange = this._onTasksModelFilterChange.bind(this);

    this._tasksModel.setOnDataChange(this._onDataChange);
    this._tasksModel.setOnFilterChange(this._onTasksModelFilterChange);
  }


  switchOff() {
    this._filterElements = this._filterComponent.getElement()
      .querySelectorAll(`.filter__input`);

    for (const filterElement of this._filterElements) {
      filterElement.disabled = true;
    }
  }


  switchOn() {
    for (const filterElement of this._filterElements) {
      filterElement.disabled = false;
    }
  }


  render() {
    const container = this._container;
    const allTasks = this._tasksModel.getTasksAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getTasksByFilter(allTasks, filterType).length,
        isChecked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setOnFilterChange(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._activeFilterType = filterType;
    this._tasksModel.setFilter(filterType);
  }

  _onDataChange() {
    this.render();
  }

  _onTasksModelFilterChange() {
    this._activeFilterType = this._tasksModel.getFilter();
    this.render();
  }
}
