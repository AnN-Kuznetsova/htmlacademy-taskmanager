import Task from "../components/task.js";
import TaskEdit from "../components/task-edit.js";
import TaskModel from "../models/task-model.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";
import {Color, DAYS} from "../const.js";


const SHAKE_ANIMATION_TIMEOUT = 600;


export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    "mo": false,
    "tu": false,
    "we": false,
    "th": false,
    "fr": false,
    "sa": false,
    "su": false,
  },
  color: Color.BLACK,
  isFavorite: false,
  isArchive: false,
};


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
    this._parseFormData = this._parseFormData.bind(this);
  }


  _parseFormData(formData) {
    const date = formData.get(`date`);
    const repeatingDays = DAYS.reduce((acc, day) => {
      acc[day] = false;
      return acc;
    }, {});

    return new TaskModel({
      "description": formData.get(`text`),
      "due_date": date ? new Date(date) : null,
      "repeating_days": formData.getAll(`repeat`).reduce((acc, it) => {
        acc[it] = true;
        return acc;
      }, repeatingDays),
      "color": formData.get(`color`),
      "is_favorite": this._task.isFavorite,
      "is_archived": this._task.isArchive,
    });
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
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyTask, null);
      }
      this._replaceEditToTask();
    }
  }


  _onEditButtonClick() {
    this._replaceTaskToEdit();
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }


  _onArchiveButtonClick() {
    const newTask = TaskModel.clone(this._task);
    newTask.isArchive = !newTask.isArchive;

    this._onDataChange(this, this._task, newTask);
  }


  _onFavoritesButtonClick() {
    const newTask = TaskModel.clone(this._task);
    newTask.isFavorite = !newTask.isFavorite;

    this._onDataChange(this, this._task, newTask);
  }


  _onEditFormSubmit(evt) {
    evt.preventDefault();

    const formData = this._taskEditComponent.getData();
    const data = this._parseFormData(formData);

    this._taskEditComponent.setData({
      saveButtonText: `Saving...`,
    });

    this._onDataChange(this, this._task, data);
    this._taskEditComponent.disableCardForm();
  }


  _onDeleteButtonClick() {
    this._taskEditComponent.setData({
      deleteButtonText: `Deleting...`,
    });

    this._onDataChange(this, this._task, null);
    this._taskEditComponent.disableCardForm();
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

    switch (mode) {
      case Mode.DEFAULT:
        if (oldTaskEditComponent && oldTaskComponent) {
          replace(this._taskComponent, oldTaskComponent);
          replace(this._taskEditComponent, oldTaskEditComponent);
          this._replaceEditToTask();
        } else {
          render(this._container, this._taskComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldTaskEditComponent && oldTaskComponent) {
          remove(oldTaskComponent);
          remove(oldTaskEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._taskEditComponent, RenderPosition.AFTERBEGIN);
        break;
      default:
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


  shake() {
    this._taskEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._taskComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._taskEditComponent.getElement().style.animation = ``;
      this._taskComponent.getElement().style.animation = ``;

      this._taskEditComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
