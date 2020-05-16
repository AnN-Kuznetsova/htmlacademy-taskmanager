import AbstractComponent from "./abstract-component.js";

export default class Loading extends AbstractComponent {

  getTemplate() {
    return (
      `<p class="board__no-tasks">
        Loading...
      </p>`
    );
  }
}
