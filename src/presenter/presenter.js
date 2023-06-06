import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import PointListView from '../view/point-list-view.js';
import EditPointView from '../view/edit-point-view.js';
import AddNewPointView from '../view/add-new-point-view.js';
import {render} from '../render.js';

export default class TripPresenter {
  constructor({contentContainer, pointsModel}) {
    this.contentContainer = contentContainer;
    this.pointListComponent = new PointListView();
    this.pointsModel = pointsModel;
  }

  init () {
    this.points = this.pointsModel.getPoints();
    this.destinations = this.pointsModel.getDestinations();
    this.offers = this.pointsModel.getOffers();

    render(new SortView(), this.contentContainer);
    render(this.pointListComponent, this.contentContainer);
    render(new EditPointView(this.points[0], this.destinations, this.offers),
      this.pointListComponent.getElement());
    render(new AddNewPointView(), this.pointListComponent.getElement());

    for (const point of this.points) {
      render(new PointView(point, this.destinations, this.offers),
        this.pointListComponent.getElement());
    }
  }
}
