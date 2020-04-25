import AbstractComponent from "./abstract-component.js";

export default class NoTasks extends AbstractComponent {

  getTemplate() {
    return (
      `<p class="board__no-tasks">
        Click «ADD NEW TASK» in menu to create your first task
      </p>`
    );
  }
}
