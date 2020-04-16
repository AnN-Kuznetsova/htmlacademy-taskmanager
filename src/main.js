import {Board} from "./components/board.js";
import {Sorting} from "./components/sort.js";
import {Filter} from "./components/filter.js";
import {LoadMoreButton} from "./components/load-more-button.js";
import {SiteMenu} from "./components/site-menu.js";
import {Task} from "./components/task.js";
import {Tasks} from "./components/tasks.js";
import {TaskEdit} from "./components/task-edit.js";
import {generateFilters} from "./mock/filter.js";
import {generateTasks} from "./mock/task.js";
import {render, RenderPosition} from "./utils.js";


const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);


const renderTask = () => {};

const renderBoard = () => {};


const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);


render(siteHeaderElement, new SiteMenu().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new Filter(filters).getElement(), RenderPosition.BEFOREEND);

/* ********************* */
/* render(siteMainElement, createBoardTemplate(), `beforeend`);

const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

render(boardElement, createSortingTemplate(), `afterbegin`);
render(taskListElement, createTaskEditTemplate(tasks[0]), `beforeend`);

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
tasks.slice(1, showingTasksCount)
  .forEach((task) => render(taskListElement, createTaskTemplate(task), `beforeend`));

render(boardElement, createLoadMoreButtonTemplate(), `beforeend`);
const loadMoreButton = boardElement.querySelector(`.load-more`);

const onLoadMoreButtonClick = () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => render(taskListElement, createTaskTemplate(task), `beforeend`));

  if (showingTasksCount >= tasks.length) {
    loadMoreButton.remove();
  }
};

loadMoreButton.addEventListener(`click`, onLoadMoreButtonClick); */
