import { Injectable } from '@angular/core';
import { LatLngLiteral } from '@agm/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/exhaustMap';

import * as fromRoot from '../../../store/app.reducer';
import * as placeListActions from './place-list.actions';
import { SearchCompleted } from '../../../core/search/store/search.actions';
import { PlacesService } from '../../places.service';

@Injectable()
export class PlaceListEffects {
  @Effect()
  getPlaces = this.actions
    .ofType(placeListActions.GET_PLACES)
    .withLatestFrom(this.store.select(fromRoot.selectFilters))
    .exhaustMap(([action, state]) => this.placesService.getPlaces(state)
      .map(response => new placeListActions.GetPlacesSuccess(response))
      .catch(() => of(new placeListActions.GetPlacesFailure()))
    );

  @Effect()
  getPlacesSuccess = this.actions
    .ofType(placeListActions.GET_PLACES_SUCCESS)
    .mapTo(new SearchCompleted());

  @Effect()
  getPlacesFailure = this.actions
    .ofType(placeListActions.GET_PLACES_FAILURE)
    .mapTo(new SearchCompleted());

  constructor(
    private store: Store<fromRoot.AppState>,
    private actions: Actions,
    private placesService: PlacesService) {}
}
