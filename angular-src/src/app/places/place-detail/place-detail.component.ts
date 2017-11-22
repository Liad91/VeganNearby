import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';


import * as fromPlaces from '../store/places.reducer';
import { GetPlace, GetReviews } from './store/place-detail.actions';
import { State } from './store/place-detail.reducer';
import { ModalService } from '../../core/services/modal.service';
import { UtilitiesService } from '../../core/services/utilities.service';
import { errorStateTrigger } from '../../shared/animations';
import { placeStateTrigger } from './animations';

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
  public state: Observable<State>
  public transactions: { pickup: boolean, delivery: boolean, reservation: boolean };
  public isOpen: boolean;

  public mapStyles = [
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        { lightness: 100 },
        { visibility: 'simplified' }
      ]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        { visibility: 'on' },
        { color: '#C6E2FF' }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'geometry.fill',
      stylers: [{ color: '#C5E3BF' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry.fill',
      stylers: [{ color: '#D1D1B8' }]
    }
  ];


  constructor(
    private store: Store<fromPlaces.FeatureState>,
    private utilitiesService: UtilitiesService,
    private modalService: ModalService) {}

  ngOnInit(): void {
    this.state = this.store.select(fromPlaces.selectPlaceDetail);

    this.state
      .filter(state => !!state.place && state.error !== 'page')
      .take(1)
      .subscribe(state => {
        this.transactions = {
          pickup: state.place.transactions.indexOf('pickup') > -1,
          delivery: state.place.transactions.indexOf('delivery') > -1,
          reservation: state.place.transactions.indexOf('restaurant_reservation') > -1,
        };

        if (state.place.hours) {
          this.isOpen = state.place.hours[0].is_open_now;
        }
      });
  }

  public openLightbox(active: number): void {
    this.state.take(1).subscribe(state => {
      this.modalService.openLightbox({ images: state.place.photos, active });
    });
  }

  public onReloadPage(): void {
    this.store.dispatch(new GetPlace(this.utilitiesService.navigationEnd.getValue().params.id));
  }

  public onReloadReviews(): void {
    this.state.take(1).subscribe(state => {
      this.store.dispatch(new GetReviews(state.place.id));
    })
  }
}
