import Board from "./components/board.js";
import FilterController from "./controllers/filter-controller.js";
import SiteMenu, {MenuItem} from "./components/site-menu.js";
import BoardController from "./controllers/board-controller.js";
import TasksModel from "./models/tasks-model.js";
import {generateTasks} from "./mock/task.js";
import {render, RenderPosition} from "./utils/render.js";


const TASK_COUNT = 22;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuComponent = new SiteMenu();

render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);

const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();

const boardComponent = new Board();
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);

const boardController = new BoardController(boardComponent, tasksModel);
boardController.render();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      boardController.createTask();
      break;
    default:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      boardController.render();
  }
});
