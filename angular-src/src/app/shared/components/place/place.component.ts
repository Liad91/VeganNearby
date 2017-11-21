import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../../store/app.reducer';
import { GetPlace, SetPlace } from '../../../places/place-detail/store/place-detail.actions';
import { YelpBusiness, YelpBusinessResponse } from '../../../models/yelp.model';
import { UtilitiesService } from '../../../core/services/utilities.service';

@Component({
  selector: 'vn-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss']
})
export class PlaceComponent {
  @Input() public place: YelpBusiness | YelpBusinessResponse;
  @Input() public listMode = false;

  getPlaceDetail(): void {
    if ((this.place as YelpBusinessResponse).hours) {
      this.store.dispatch(new SetPlace((this.place as YelpBusinessResponse)));
    }
    else {
      this.store.dispatch(new GetPlace(this.place.id));
    }
    this.utilitiesService.navigate(['places', 'place', this.place.id], {}, { scroll: true });
  }

  constructor(private store: Store<AppState>, private utilitiesService: UtilitiesService) {}
}
