import {AbstractComponent} from "./abstract-component.js";

export class Board extends AbstractComponent {

  getTemplate() {
    return (
      `<section class="board container"></section>`
    );
  }
}
