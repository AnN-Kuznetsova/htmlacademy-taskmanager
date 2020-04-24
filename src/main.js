import {Board} from "./components/board.js";
import {Filter} from "./components/filter.js";
import {SiteMenu} from "./components/site-menu.js";
import {generateFilters} from "./mock/filter.js";
import {generateTasks} from "./mock/task.js";
import {render, RenderPosition} from "./utils/render.js";
import {BoardController} from "./controllers/board-controller.js";


const TASK_COUNT = 22;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);


const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);


render(siteHeaderElement, new SiteMenu(), RenderPosition.BEFOREEND);
render(siteMainElement, new Filter(filters), RenderPosition.BEFOREEND);

const boardComponent = new Board();
const boardController = new BoardController(boardComponent);

render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
boardController.render(tasks);

