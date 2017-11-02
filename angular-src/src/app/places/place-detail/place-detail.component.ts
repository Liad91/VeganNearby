import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';


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
  }
}
