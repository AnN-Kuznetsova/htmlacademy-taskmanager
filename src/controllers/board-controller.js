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

    this._showingTasksCount = 0;
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


  _renderLoadMoreButton(taskListElement, showingTasks) {
    if (this._showingTasksCount >= showingTasks.length) {
      return;
    }

    render(this._boardComponent.getElement(), this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    const onLoadMoreButtonClick = () => {
      const prevTasksCount = this._showingTasksCount;
      this._showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;

      this._renderTasks(taskListElement, showingTasks.slice(prevTasksCount, this._showingTasksCount));

      if (this._showingTasksCount >= showingTasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    };

    this._loadMoreButtonComponent.setOnLoadMoreButtonClick(onLoadMoreButtonClick);
  }


  render(tasks) {
    let showingTasks = tasks.slice();

    const boardElement = this._boardComponent.getElement();
    const isAllTasksArchived = showingTasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(boardElement, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(boardElement, this._sortComponent, RenderPosition.BEFOREEND);
    render(boardElement, this._tasksComponent, RenderPosition.BEFOREEND);

    const taskListElement = boardElement.querySelector(`.board__tasks`);

    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    this._renderTasks(taskListElement, showingTasks.slice(0, this._showingTasksCount));

    this._renderLoadMoreButton(taskListElement, showingTasks);

    const onSortTypeChange = () => {
      showingTasks = this._sortComponent.getSortedTasks(tasks);
      this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
      taskListElement.innerHTML = ``;
      this._renderTasks(taskListElement, showingTasks.slice(0, this._showingTasksCount));
      this._renderLoadMoreButton(taskListElement, showingTasks);
    };

    this._sortComponent.setOnSortTypeChange(onSortTypeChange);
  }
}
