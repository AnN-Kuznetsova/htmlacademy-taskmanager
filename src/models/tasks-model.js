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

  _getTaskIndex(taskId) {
    return this._tasks.findIndex((it) => it.id === taskId);
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

  removeTask(id) {
    const index = this._getTaskIndex(id);

    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), this._tasks.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  updateTask(id, task) {
    const index = this._getTaskIndex(id);

    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), task, this._tasks.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addTask(task) {
    this._tasks = [].concat(task, this._tasks);
    this._callHandlers(this._dataChangeHandlers);
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

  getFilter() {
    return this._activeFilterType;
  }
}
