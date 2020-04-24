import {AbstractComponent} from "./abstract-component.js";

export class Tasks extends AbstractComponent {

  getTemplate() {
    return (
      `<div class="board__tasks"></div>`
    );
  }
}
