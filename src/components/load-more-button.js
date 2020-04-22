import {AbstractComponent} from "./abstract-component.js";

export class LoadMoreButton extends AbstractComponent {

  getTemplate() {
    return (
      `<button class="load-more" type="button">load more</button>`
    );
  }

  setOnLoadMoreButtonClick(cb) {
    this.getElement().addEventListener(`click`, cb);
  }
}
