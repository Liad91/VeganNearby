import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  catchError,
  exhaustMap,
  map,
  mapTo,
  withLatestFrom
} from 'rxjs/operators';

import { SearchCompleted } from '../../../../core/components/search/store/search.actions';
import * as fromRoot from '../../../../store/app.reducer';
import { PlacesService } from '../../../places.service';
import * as placeListActions from './place-list.actions';

@Injectable()
export class PlaceListEffects {
  @Effect()
  getPlaces = this.actions.pipe(
    ofType(placeListActions.GET_PLACES),
    withLatestFrom(this.store.select(fromRoot.selectFilters)),
    exhaustMap(([action, state]) => this.placesService.getPlaces(state)
      .pipe(
        map(response => new placeListActions.GetPlacesSuccess(response)),
        catchError(() => of(new placeListActions.GetPlacesFailure()))
      )
    )
  );

  @Effect()
  getPlacesSuccess = this.actions.pipe(
    ofType(placeListActions.GET_PLACES_SUCCESS),
    mapTo(new SearchCompleted())
  );

  @Effect()
  getPlacesFailure = this.actions.pipe(
    ofType(placeListActions.GET_PLACES_FAILURE),
    mapTo(new SearchCompleted())
  );

  constructor(private store: Store<fromRoot.AppState>, private actions: Actions, private placesService: PlacesService) { }
}
