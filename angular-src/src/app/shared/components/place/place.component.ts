import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppState } from '../../../store/app.reducers';
import { GetPlace, SetPlace } from '../../../places/place-detail/store/place-detail.actions';
import { YelpBusiness, YelpBusinessResponse } from '../../../models/yelp.model';

@Component({
  selector: 'vn-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss']
})
export class PlaceComponent {
  @Input() public place: YelpBusiness | YelpBusinessResponse;

  getPlaceDetail(): void {
    if ((this.place as YelpBusinessResponse).hours) {
      this.store.dispatch(new SetPlace((this.place as YelpBusinessResponse)));
    }
    else {
      this.store.dispatch(new GetPlace(this.place.id));
    }
    this.router.navigate(['places', 'place', this.place.id]);
  }

  constructor(private store: Store<AppState>, private router: Router) {}
}
