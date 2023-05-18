import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import PointListView from '../view/point-list-view.js';
import EditPointView from '../view/edit-point-view.js';
import AddNewPointView from '../view/add-new-point-view.js';
import {render} from '../render.js';

export default class TripPresenter {
  pointListComponent = new PointListView();

  constructor({contentContainer}) {
    this.contentContainer = contentContainer;
  }

  init () {
    render(new SortView(), this.contentContainer);
    render(this.pointListComponent, this.contentContainer)
    render(new EditPointView, this.pointListComponent.getElement());
    render(new AddNewPointView(), this.pointListComponent.getElement());
    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.pointListComponent.getElement());
    }
  }
}
