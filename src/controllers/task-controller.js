import Task from "../components/task.js";
import TaskEdit from "../components/task-edit.js";
import {render, replace, RenderPosition} from "../utils/render.js";


export default class TaskController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._task = null;
    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }


  _replaceTaskToEdit() {
    replace(this._taskEditComponent, this._taskComponent);
  }


  _replaceEditToTask() {
    replace(this._taskComponent, this._taskEditComponent);
  }


  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }


  _onEditButtonClick() {
    this._replaceTaskToEdit();
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }


  _onArchiveButtonClick() {
    this._onDataChange(this, this._task, Object.assign({}, this._task, {isArchive: !this._task.isArchive}));
  }


  _onFavoritesButtonClick() {
    this._onDataChange(this, this._task, Object.assign({}, this._task, {isFavorite: !this._task.isFavorite}));
  }


  _onEditFormSubmit() {
    this._replaceEditToTask();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }


  render(task) {
    this._task = task;
    this._taskComponent = new Task(this._task);
    this._taskComponent.setOnEditButtonClick(this._onEditButtonClick.bind(this));
    this._taskComponent.setOnArchiveButtonClick(this._onArchiveButtonClick.bind(this));
    this._taskComponent.setOnFavoritesButtonClick(this._onFavoritesButtonClick.bind(this));

    this._taskEditComponent = new TaskEdit(this._task);
    this._taskEditComponent.setOnEditFormSubmit(this._onEditFormSubmit.bind(this));

    render(this._container, this._taskComponent, RenderPosition.BEFOREEND);
  }
}
