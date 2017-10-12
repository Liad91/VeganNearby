import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { LatLngLiteral } from '@agm/core';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/exhaustMap';

import { FeatureState } from '../../store/places.reducers';
import { SearchSuccess } from '../../../core/search/store/search.actions';
import { PlacesService } from '../../places.service';
import * as placeListActions from './place-list.actions';

@Injectable()
export class PlaceListEffects {
  @Effect()
  getPlacesByLocation = this.actions
    .ofType(placeListActions.GET_PLACES)
    .withLatestFrom(this.store.select('filters'))
    .exhaustMap(([action, state]) => this.placesService.getPlaces(state)
      .map(response => new placeListActions.GetPlacesSuccess(response))
      .catch(error => of(this.getPlacesFailure()))
    );

  @Effect()
  getPlacesSuccess = this.actions
    .ofType(placeListActions.GET_PLACES_SUCCESS)
    .map(() => new SearchSuccess());

  constructor(private store: Store<FeatureState>, private actions: Actions, private placesService: PlacesService) {}

  private getPlacesFailure() {
    // Handle errors
    // this.toastService.show('Connection error, please try again');
  }
}
