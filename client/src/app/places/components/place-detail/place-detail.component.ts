import { AgmMap } from '@agm/core';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { ModalService } from '../../../core/services/modal.service';
import { UtilitiesService } from '../../../core/services/utilities.service';
import { errorStateTrigger } from '../../../shared/animations';
import { LightboxModalComponent } from './../../../core/components/modals/lightbox-modal/lightbox-modal.component';
import mapStyles from '../../data/map-styles';
import * as fromPlaces from '../../store/places.reducer';
import { placeStateTrigger } from './animations';
import { GetPlace, GetReviews } from './store/place-detail.actions';
import { State } from './store/place-detail.reducer';

interface Transactions {
  pickup: boolean;
  delivery: boolean;
  reservation: boolean;
}

@Component({
  selector: 'vn-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.scss'],
  animations: [
    placeStateTrigger,
    errorStateTrigger
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaceDetailComponent implements OnInit, OnDestroy {
  @ViewChild(AgmMap) map: any;
  public state: State;
  private stateSubscription: Subscription;
  public mapStyles = mapStyles;
  public transactions: Transactions;
  public isOpen: boolean;

  constructor(
    private store: Store<fromPlaces.FeatureState>,
    private utilitiesService: UtilitiesService,
    private modalService: ModalService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.stateSubscription = this.store.select(fromPlaces.selectPlaceDetail).subscribe(
      state => {
        this.state = state;

        if (!this.transactions && this.state.place && this.state.error !== 'page') {
          this.transactions = {
            pickup: this.state.place.transactions.indexOf('pickup') > -1,
            delivery: this.state.place.transactions.indexOf('delivery') > -1,
            reservation: this.state.place.transactions.indexOf('restaurant_reservation') > -1
          };

          if (this.state.place.hours) {
            this.isOpen = this.state.place.hours[0].is_open_now;
          }
        }

        this.changeDetectorRef.markForCheck();
      }
    );
  }

  public openLightbox(active: number): void {
    this.modalService.openLightbox(LightboxModalComponent, { images: this.state.place.photos, active });
  }

  public onReloadPage(): void {
    this.store.dispatch(new GetPlace(this.utilitiesService.navigationEnd.getValue().params.id));
  }

  public onReloadReviews(): void {
    this.store.dispatch(new GetReviews(this.state.place.id));
  }

  ngOnDestroy() {
    this.stateSubscription.unsubscribe();

    // Fix DOM nodes leak
    // TODO: Remove after https://github.com/SebastianM/angular-google-maps/pull/1406 will merged
    if (this.map) {
      this.map._mapsWrapper.getNativeMap().then(map => google.maps.event.clearInstanceListeners(map));
    }
  }
}
