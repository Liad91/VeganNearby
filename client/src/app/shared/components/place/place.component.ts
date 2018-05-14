import { ChangeDetectionStrategy, Component, HostListener, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { UtilitiesService } from '../../../core/services/utilities.service';
import { YelpBusiness, YelpBusinessResponse } from '../../../models/yelp.model';
import { GetPlace, SetPlace } from '../../../places/components/place-detail/store/place-detail.actions';
import { AppState } from '../../../store/app.reducer';

@Component({
  selector: 'vn-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaceComponent {
  @Input() public place: YelpBusiness | YelpBusinessResponse;
  @Input() public featured: boolean;
  @HostListener('click')
  private onClick(): void {
    if ((<YelpBusinessResponse>this.place).hours) {
      this.store.dispatch(new SetPlace(<YelpBusinessResponse>this.place));
    }
    else {
      this.store.dispatch(new GetPlace(this.place.id));
    }
    this.utilitiesService.navigate(['places', 'place', this.place.id], {}, { scroll: true });
  }

  constructor(private store: Store<AppState>, private utilitiesService: UtilitiesService) { }
}
