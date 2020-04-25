import Sort from "../components/sort.js";
import LoadMoreButton from "../components/load-more-button.js";
import Task from "../components/task.js";
import Tasks from "../components/tasks.js";
import TaskEdit from "../components/task-edit.js";
import NoTasks from "../components/no-tasks.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";


const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

export default class BoardController {
  constructor(boardComponent) {
    this._boardComponent = boardComponent;

    this._noTasksComponent = new NoTasks();
    this._sortComponent = new Sort();
    this._tasksComponent = new Tasks();
    this._loadMoreButtonComponent = new LoadMoreButton();
  }


  _renderTask(taskListElement, task) {
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
  }


  _renderTasks(taskListElement, tasks) {
    tasks.forEach((task) => {
      this._renderTask(taskListElement, task);
    });
  }


  render(tasks) {
    const boardElement = this._boardComponent.getElement();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(boardElement, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(boardElement, this._sortComponent, RenderPosition.BEFOREEND);
    render(boardElement, this._tasksComponent, RenderPosition.BEFOREEND);

    const taskListElement = boardElement.querySelector(`.board__tasks`);

    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    this._renderTasks(taskListElement, tasks.slice(0, showingTasksCount));

    render(boardElement, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    const onLoadMoreButtonClick = () => {
      const prevTasksCount = showingTasksCount;
      showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;

      this._renderTasks(taskListElement, tasks.slice(prevTasksCount, showingTasksCount));

      if (showingTasksCount >= tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    };

    this._loadMoreButtonComponent.setOnLoadMoreButtonClick(onLoadMoreButtonClick);

    this._sortComponent.setOnSortTypeChange(() => {});
  }
}
