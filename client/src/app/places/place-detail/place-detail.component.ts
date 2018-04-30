import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { take, filter } from 'rxjs/operators';

import mapStyles from '../data/map-styles';
import * as fromPlaces from '../store/places.reducer';
import { GetPlace, GetReviews } from './store/place-detail.actions';
import { State } from './store/place-detail.reducer';
import { ModalService } from '../../core/services/modal.service';
import { UtilitiesService } from '../../core/services/utilities.service';
import { errorStateTrigger } from '../../shared/animations';
import { placeStateTrigger } from './animations';
import { LightboxModalComponent } from '../../shared/components/lightbox-modal/lightbox-modal.component';

@Component({
  selector: 'vn-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.scss'],
  animations: [
    placeStateTrigger,
    errorStateTrigger
  ]
})

export class PlaceDetailComponent implements OnInit {
  public state: Observable<State>;
  public mapStyles = mapStyles;
  public transactions: { pickup: boolean, delivery: boolean, reservation: boolean };
  public isOpen: boolean;

  constructor(
    private store: Store<fromPlaces.FeatureState>,
    private utilitiesService: UtilitiesService,
    private modalService: ModalService) { }

  ngOnInit(): void {
    this.state = this.store.select(fromPlaces.selectPlaceDetail);

    this.state
      .pipe(
        filter(state => !!state.place && state.error !== 'page'),
        take(1)
      )
      .subscribe(state => {
        this.transactions = {
          pickup: state.place.transactions.indexOf('pickup') > -1,
          delivery: state.place.transactions.indexOf('delivery') > -1,
          reservation: state.place.transactions.indexOf('restaurant_reservation') > -1
        };

        if (state.place.hours) {
          this.isOpen = state.place.hours[0].is_open_now;
        }
      });
  }

  public openLightbox(active: number): void {
    this.state
      .pipe(
        take(1)
      )
      .subscribe(state => {
        this.modalService.openLightbox(LightboxModalComponent, { images: state.place.photos, active });
      });
  }

  public onReloadPage(): void {
    this.store.dispatch(new GetPlace(this.utilitiesService.navigationEnd.getValue().params.id));
  }

  public onReloadReviews(): void {
    this.state
      .pipe(
        take(1)
      )
      .subscribe(state => {
        this.store.dispatch(new GetReviews(state.place.id));
      });
  }
}
