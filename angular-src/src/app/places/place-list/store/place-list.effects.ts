import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { LatLngLiteral } from '@agm/core';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/exhaustMap';

import * as fromRoot from '../../../store/app.reducers';
import * as placeListActions from './place-list.actions';
import { SearchSuccess } from '../../../core/search/store/search.actions';
import { PlacesService } from '../../places.service';

@Injectable()
export class PlaceListEffects {
  @Effect()
  getPlaces = this.actions
    .ofType(placeListActions.GET_PLACES)
    .withLatestFrom(this.store.select(fromRoot.selectFilters))
    .exhaustMap(([action, state]) => this.placesService.getPlaces(state)
      .map(response => new placeListActions.GetPlacesSuccess(response))
      .catch(() => of(this.getPlacesFailure()))
    );

  @Effect()
  getPlacesSuccess = this.actions
    .ofType(placeListActions.GET_PLACES_SUCCESS)
    .map(() => new SearchSuccess());

  constructor(private store: Store<fromRoot.AppState>, private actions: Actions, private placesService: PlacesService) {}
  private getPlacesFailure() {

    // Handle errors
    // this.toastService.show('Connection error, please try again');
  }
}
