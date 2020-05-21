import API from "./api/index.js";
import Board from "./components/board.js";
import BoardController from "./controllers/board-controller.js";
import FilterController from "./controllers/filter-controller.js";
import Loading from "./components/loading.js";
import Provider from "./api/provider.js";
import SiteMenu, {MenuItem} from "./components/site-menu.js";
import Statistics from "./components/statistics.js";
import Store from "./api/store.js";
import TasksModel from "./models/tasks-model.js";
import {render, RenderPosition, remove} from "./utils/render.js";


const AUTHORIZATION = `Basic fdHJdhfvhd=565Jfvf`;
const END_POINT = `https://11.ecmascript.pages.academy/task-manager`;
const STORE_PREFIX = `taskmanager-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;


const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();


const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const tasksModel = new TasksModel();


const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuComponent = new SiteMenu();
const statisticsComponent = new Statistics({tasksModel, dateFrom, dateTo});

const loadingComponent = new Loading();
const boardComponent = new Board();
const boardController = new BoardController(boardComponent, tasksModel, apiWithProvider);
const filterController = new FilterController(siteMainElement, tasksModel);

render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);
filterController.render();
filterController.renderDisabled(true);
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
render(boardComponent.getElement(), loadingComponent, RenderPosition.AFTERBEGIN);
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();


boardController.setNoTasksDisplayChangeHandlers(filterController.renderDisabled);


siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      statisticsComponent.hide();
      boardController.show();
      boardController.createTask();
      break;
    case MenuItem.STATISTICS:
      boardController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TASKS:
      statisticsComponent.hide();
      boardController.show();
      break;
    default:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      statisticsComponent.hide();
      boardController.show();
      boardController.render();
  }
});


apiWithProvider.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
  })
  .catch(() => {
    tasksModel.setTasks([]);
  })
  .then(() => {
    remove(loadingComponent);
    boardController.render();
  });
