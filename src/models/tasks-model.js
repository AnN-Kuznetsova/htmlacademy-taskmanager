import {getTasksByFilter} from "../utils/filter.js";
import {FilterType} from "../const.js";


export default class TasksModel {
  constructor() {
    this._tasks = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }


  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  getTasks() {
    return getTasksByFilter(this._tasks, this._activeFilterType);
  }

  getTasksAll() {
    return this._tasks;
  }

  setTasks(tasks) {
    this._tasks = Array.from(tasks);
    this._callHandlers(this._dataChangeHandlers);
  }

  updateTask(id, task) {
    const index = this._tasks.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), task, this._tasks.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setOnDataChange(cb) {
    this._dataChangeHandlers.push(cb);
  }

  setOnFilterChange(cb) {
    this._filterChangeHandlers.push(cb);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }
}
