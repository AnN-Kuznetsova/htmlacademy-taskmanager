import Board from "./components/board.js";
import FilterController from "./controllers/filter-controller.js";
import SiteMenu from "./components/site-menu.js";
import BoardController from "./controllers/board-controller.js";
import TasksModel from "./models/tasks-model.js";
import {generateTasks} from "./mock/task.js";
import {render, RenderPosition} from "./utils/render.js";


const TASK_COUNT = 22;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, new SiteMenu(), RenderPosition.BEFOREEND);

const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();

const boardComponent = new Board();
const boardController = new BoardController(boardComponent, tasksModel);

render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
boardController.render();

