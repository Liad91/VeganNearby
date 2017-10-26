import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/take';

import * as fromPlaces from '../store/places.reducers';
import { GetPlace } from './store/place-detail.actions';
import { State } from './store/place-detail.reducers';

@Component({
  selector: 'vn-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.scss']
})

export class PlaceDetailComponent implements OnInit, OnDestroy {
  public state: Observable<State>
  private paramsSubscription: Subscription;

  constructor(private store: Store<fromPlaces.FeatureState>, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.state = this.store.select(fromPlaces.selectPlaceDetail);

    this.state.take(1).subscribe(state => {
      if (!state.place && !state.loading && !state.error) {
        this.paramsSubscription = this.route.params.subscribe(params => {
          this.store.dispatch(new GetPlace(params.id));
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }
}
