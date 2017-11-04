import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';


import * as fromPlaces from '../store/places.reducers';
import { GetPlace } from './store/place-detail.actions';
import { State } from './store/place-detail.reducers';

@Component({
  selector: 'vn-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.scss']
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


  constructor(private store: Store<fromPlaces.FeatureState>) {}

  ngOnInit(): void {
    this.state = this.store.select(fromPlaces.selectPlaceDetail);

    this.state
      .filter(state => !!state.place)
      .take(1)
      .subscribe(state => {
        this.transactions = {
          pickup: state.place.transactions.indexOf('pickup') > -1,
          delivery: state.place.transactions.indexOf('delivery') > -1,
          reservation: state.place.transactions.indexOf('restaurant_reservation') > -1,
        };

        this.isOpen = state.place.hours[0].is_open_now;
      })
  }
}
