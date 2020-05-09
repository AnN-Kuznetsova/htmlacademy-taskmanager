import Task from "../components/task.js";
import TaskEdit from "../components/task-edit.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";


export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyTask = {};

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._task = null;
    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }


  _replaceTaskToEdit() {
    this._onViewChange();
    replace(this._taskEditComponent, this._taskComponent);
    this._mode = Mode.EDIT;
  }


  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._taskEditComponent.reset();

    if (document.contains(this._taskEditComponent.getElement())) {
      replace(this._taskComponent, this._taskEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }


  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToTask();
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


  _onEditFormSubmit(evt) {
    evt.preventDefault();
    const data = this._taskEditComponent.getData();
    this._onDataChange(this, this._task, data);
  }


  _onDeleteButtonClick() {
    this._onDataChange(this, this._task, null);
  }


  render(task, mode) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;
    this._mode = mode;

    this._task = task;
    this._taskComponent = new Task(this._task);
    this._taskComponent.setOnEditButtonClick(this._onEditButtonClick.bind(this));
    this._taskComponent.setOnArchiveButtonClick(this._onArchiveButtonClick.bind(this));
    this._taskComponent.setOnFavoritesButtonClick(this._onFavoritesButtonClick.bind(this));

    this._taskEditComponent = new TaskEdit(this._task);
    this._taskEditComponent.setOnEditFormSubmit(this._onEditFormSubmit.bind(this));
    this._taskEditComponent.setOnDeleteButtonClick(this._onDeleteButtonClick.bind(this));


    if (oldTaskEditComponent && oldTaskComponent) {
      replace(this._taskComponent, oldTaskComponent);
      replace(this._taskEditComponent, oldTaskEditComponent);
      this._replaceEditToTask();
    } else {
      render(this._container, this._taskComponent, RenderPosition.BEFOREEND);
    }
  }


  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }


  destroy() {
    remove(this._taskEditComponent);
    remove(this._taskComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}
