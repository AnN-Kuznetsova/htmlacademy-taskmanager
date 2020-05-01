import Sort from "../components/sort.js";
import LoadMoreButton from "../components/load-more-button.js";
import Tasks from "../components/tasks.js";
import NoTasks from "../components/no-tasks.js";
import TaskController from "./task-controller.js";
import {render, RenderPosition, remove} from "../utils/render.js";


const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

export default class BoardController {
  constructor(boardComponent) {
    this._boardComponent = boardComponent;

    this._noTasksComponent = new NoTasks();
    this._sortComponent = new Sort();
    this._tasksComponent = new Tasks();
    this._loadMoreButtonComponent = new LoadMoreButton();

    this._tasks = [];
    this._showingTasks = [];
    this._showingTaskControllers = [];
    this._showingTasksCount = 0;
  }


  _renderTasks(tasks) {
    const newTaskControllers = tasks.map((task) => {
      const taskController = new TaskController(this._tasksComponent.getElement());

      taskController.render(task);

      return taskController;
    });

    this._showingTaskControllers = this._showingTaskControllers.concat(newTaskControllers);
  }


  _renderLoadMoreButton() {
    const boardElement = this._boardComponent.getElement();

    if ((this._showingTasksCount >= this._showingTasks.length)
      || (boardElement.contains(this._loadMoreButtonComponent.getElement()))) {
      return;
    }

    render(boardElement, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    const onLoadMoreButtonClick = () => {
      const prevTasksCount = this._showingTasksCount;
      this._showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;

      this._renderTasks(this._showingTasks.slice(prevTasksCount, this._showingTasksCount));

      if (this._showingTasksCount >= this._showingTasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    };

    this._loadMoreButtonComponent.setOnLoadMoreButtonClick(onLoadMoreButtonClick);
  }


  _renderTaskList() {
    this._tasksComponent.getElement().innerHTML = ``;
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    this._renderTasks(this._showingTasks.slice(0, this._showingTasksCount));
    this._renderLoadMoreButton();
  }


  _onSortTypeChange() {
    this._showingTaskControllers = [];
    this._showingTasks = this._sortComponent.getSortedTasks(this._tasks);
    this._renderTaskList();
  }


  render(tasks) {
    this._tasks = tasks;
    this._showingTasks = tasks.slice();

    const boardElement = this._boardComponent.getElement();
    const isAllTasksArchived = this._showingTasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(boardElement, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(boardElement, this._sortComponent, RenderPosition.BEFOREEND);
    render(boardElement, this._tasksComponent, RenderPosition.BEFOREEND);

    this._renderTaskList();

    this._sortComponent.setOnSortTypeChange(this._onSortTypeChange.bind(this));
  }
}
