import {Sort} from "../components/sort.js";
import {LoadMoreButton} from "../components/load-more-button.js";
import {Task} from "../components/task.js";
import {Tasks} from "../components/tasks.js";
import {TaskEdit} from "../components/task-edit.js";
import {NoTasks} from "../components/no-tasks.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";


const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTask = (taskListElement, task) => {
  const replaceTaskToEdit = () => {
    replace(taskEditComponent, taskComponent);
  };

  const replaceEditToTask = () => {
    replace(taskComponent, taskEditComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const onEditButtonClick = () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const onEditFormSubmit = () => {
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const taskComponent = new Task(task);
  taskComponent.setOnEditButtonClick(onEditButtonClick);

  const taskEditComponent = new TaskEdit(task);
  taskEditComponent.setOnEditFormSubmit(onEditFormSubmit);

  render(taskListElement, taskComponent, RenderPosition.BEFOREEND);
};


const renderBoard = (boardComponent, tasks) => {
  const isAllTasksArchived = tasks.every((task) => task.isArchive);

  if (isAllTasksArchived) {
    render(boardComponent.getElement(), new NoTasks(), RenderPosition.BEFOREEND);
    return;
  }

  render(boardComponent.getElement(), new Sort(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), new Tasks(), RenderPosition.BEFOREEND);

  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
  tasks.slice(0, showingTasksCount)
    .forEach((task) => renderTask(taskListElement, task));

  const loadMoreButtonComponent = new LoadMoreButton();
  render(boardComponent.getElement(), loadMoreButtonComponent, RenderPosition.BEFOREEND);

  const onLoadMoreButtonClick = () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;

    tasks.slice(prevTasksCount, showingTasksCount)
      .forEach((task) => renderTask(taskListElement, task));

    if (showingTasksCount >= tasks.length) {
      remove(loadMoreButtonComponent);
    }
  };

  loadMoreButtonComponent.setOnLoadMoreButtonClick(onLoadMoreButtonClick);
};


export class BoardController {
  constructor(container) {
    this._container = container;
  }

  render(tasks) {
    renderBoard(this._container, tasks);
  }
}
