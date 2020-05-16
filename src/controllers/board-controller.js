import Sort, {SortType} from "../components/sort.js";
import LoadMoreButton from "../components/load-more-button.js";
import Tasks from "../components/tasks.js";
import NoTasks from "../components/no-tasks.js";
import TaskController, {Mode as TaskControllerMode, EmptyTask} from "./task-controller.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {FilterType} from "../const.js";


const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

export default class BoardController {
  constructor(boardComponent, tasksModel, api) {
    this._boardComponent = boardComponent;
    this._tasksModel = tasksModel;
    this._api = api;

    this._showingTasks = [];
    this._showingTaskControllers = [];
    this._showingTasksCount = 0;
    this._creatingTaskController = null;

    this._noTasksComponent = new NoTasks();
    this._sortComponent = new Sort();
    this._tasksComponent = new Tasks();
    this._loadMoreButtonComponent = new LoadMoreButton();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);

    this._noTasksDisplayChangeHandlers = [];

    this._sortComponent.setOnSortTypeChange(this._onSortTypeChange);
    this._tasksModel.setOnFilterChange(this._onFilterChange);
  }


  _removeTasks() {
    this._showingTaskControllers.forEach((taskController) => taskController.destroy());
    this._showingTaskControllers = [];
  }


  _updateTasks() {
    if (this._creatingTaskController) {
      this._creatingTaskController.destroy();
      this._creatingTaskController = null;
    }

    this._showingTasks = this._sortComponent.getSortedTasks(this._tasksModel.getTasks());
    this._renderTaskList();
  }


  _onSortTypeChange() {
    this._updateTasks();
  }


  _onFilterChange() {
    this._updateTasks();
  }


  _renderTasks(tasks, onDataChange, onViewChange) {
    const newTaskControllers = tasks.map((task) => {
      const taskController = new TaskController(this._tasksComponent.getElement(), onDataChange, onViewChange);

      taskController.render(task, TaskControllerMode.DEFAULT);

      return taskController;
    });

    this._showingTaskControllers = this._showingTaskControllers.concat(newTaskControllers);
  }


  _renderLoadMoreButton() {
    const boardElement = this._boardComponent.getElement();

    if (this._showingTasksCount >= this._showingTasks.length) {
      if (boardElement.contains(this._loadMoreButtonComponent.getElement())) {
        remove(this._loadMoreButtonComponent);
      }
      return;
    }

    render(boardElement, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);
    this._loadMoreButtonComponent.setOnLoadMoreButtonClick(this._onLoadMoreButtonClick);
  }


  _onLoadMoreButtonClick() {
    const prevTasksCount = this._showingTasksCount;
    this._showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;

    this._renderTasks(this._showingTasks.slice(prevTasksCount, this._showingTasksCount), this._onDataChange, this._onViewChange);

    if (this._showingTasksCount >= this._showingTasks.length) {
      remove(this._loadMoreButtonComponent);
    }
  }


  _renderTaskList() {
    const isAllTasksArchived = this._showingTasks.every((task) => task.isArchive);

    if (isAllTasksArchived || !this._showingTasks.length) {
      this._renderNoTasksDisplay();
      return;
    }

    this._removeNoTasksDisplay();

    this._removeTasks();
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    this._renderTasks(this._showingTasks.slice(0, this._showingTasksCount), this._onDataChange, this._onViewChange);
    this._renderLoadMoreButton();
  }


  _onDataChange(taskController, oldData, newData) {
    if (oldData === EmptyTask) {
      if (newData === null) {
        this._updateTasks();
      } else {
        this._tasksModel.addTask(newData);
        this._updateTasks();
      }
    } else if (newData === null) {
      this._tasksModel.removeTask(oldData.id);
      this._updateTasks();
    } else {
      this._api.updateTask(oldData.id, newData)
        .then((taskModel) => {
          const isSuccess = this._tasksModel.updateTask(oldData.id, taskModel);

          if (isSuccess) {
            taskController.render(taskModel, TaskControllerMode.DEFAULT);
          }
        });
    }
  }


  _onViewChange() {
    this._showingTaskControllers.forEach((it) => it.setDefaultView());
  }


  render() {
    const tasks = this._tasksModel.getTasks();
    this._showingTasks = tasks.slice();

    const boardElement = this._boardComponent.getElement();

    render(boardElement, this._sortComponent, RenderPosition.AFTERBEGIN);
    render(boardElement, this._tasksComponent, RenderPosition.BEFOREEND);

    this._renderTaskList();
  }


  _renderNoTasksDisplay() {
    this._sortComponent.getElement().remove();
    this._callNoTasksDisplayChangeHandlers(this._noTasksDisplayChangeHandlers, true);

    render(this._boardComponent.getElement(), this._noTasksComponent, RenderPosition.AFTERBEGIN);
  }


  _removeNoTasksDisplay() {
    const noTasksElement = this._noTasksComponent.getElement();

    if (noTasksElement) {
      noTasksElement.remove();
    }

    render(this._boardComponent.getElement(), this._sortComponent, RenderPosition.AFTERBEGIN);
    this._callNoTasksDisplayChangeHandlers(this._noTasksDisplayChangeHandlers, false);
  }


  createTask() {
    if (this._creatingTaskController) {
      return;
    }

    this._resetBoard();

    const taskListElement = this._tasksComponent.getElement();
    this._creatingTaskController = new TaskController(taskListElement, this._onDataChange, this._onViewChange);
    this._creatingTaskController.render(EmptyTask, TaskControllerMode.ADDING);
  }


  _resetBoard() {
    this._sortComponent.setSortType(SortType.DEFAULT);
    this._tasksModel.setFilter(FilterType.ALL);
  }


  _callNoTasksDisplayChangeHandlers(handlers, displayMode) {
    handlers.forEach((handler) => handler(displayMode));
  }


  hide() {
    this._resetBoard();
    this._boardComponent.hide();
  }


  show() {
    this._resetBoard();
    this._boardComponent.show();
  }


  setNoTasksDisplayChangeHandlers(handler) {
    this._noTasksDisplayChangeHandlers.push(handler);
  }
}
