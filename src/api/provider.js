import TaskModel from "../models/task-model.js";
import {isOnline} from "../utils/common.js";
import {nanoid} from "nanoid";


export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }


  getTasks() {
    if (isOnline()) {
      return this._api.getTasks()
        .then((tasks) => {
          const items = this._createStoreStructure(tasks.map((task) => task.toRAW()));

          this._store.setItems(items);

          return tasks;
        });
    }

    const storeTasks = Object.values(this._store.getItems());

    return Promise.resolve(TaskModel.parseTasks(storeTasks));
  }


  createTask(task) {
    if (isOnline()) {
      return this._api.createTask(task)
        .then((newTask) => {
          this._store.setItem(newTask.id, newTask.toRAW());

          return newTask;
        });
    }

    const localNewTaskId = nanoid();
    const localNewTask = TaskModel.clone(Object.assign(task, {id: localNewTaskId}));

    this._store.setItem(localNewTask.id, localNewTask.toRAW());

    return Promise.resolve(localNewTask);
  }


  updateTask(id, task) {
    if (isOnline()) {
      return this._api.updateTask(id, task)
        .then((newTask) => {
          this._store.setItem(newTask.id, newTask.toRAW());

          return newTask;
        });
    }

    const localTask = TaskModel.clone(Object.assign(task, {id}));

    this._store.setItem(id, localTask.toRAW());

    return Promise.resolve(localTask);
  }


  deleteTask(id) {
    if (isOnline()) {
      return this._api.deleteTask(id)
        .then(() => this._store.removeItem(id));
    }

    this._store.removeItem(id);

    return Promise.resolve();
  }


  sync() {
    if (isOnline()) {
      const storeTasks = Object.values(this._store.getItems());

      return this._api.sync(storeTasks)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const createdTasks = this._getSyncedTasks(response.created);
          const updatedTasks = this._getSyncedTasks(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = this._createStoreStructure([...createdTasks, ...updatedTasks]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }


  _getSyncedTasks(items) {
    return items.filter(({success}) => success)
      .map(({payload}) => payload.task);
  }


  _createStoreStructure(items) {
    return items.reduce((acc, current) => {
      return Object.assign({}, acc, {
        [current.id]: current,
      });
    }, {});
  }
}
