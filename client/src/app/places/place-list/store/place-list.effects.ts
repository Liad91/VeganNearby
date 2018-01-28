import { Injectable } from '@angular/core';
import { LatLngLiteral } from '@agm/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { map, mapTo, catchError, withLatestFrom, exhaustMap } from 'rxjs/operators';

import * as fromRoot from '../../../store/app.reducer';
import * as placeListActions from './place-list.actions';
import { SearchCompleted } from '../../../core/search/store/search.actions';
import { PlacesService } from '../../places.service';

@Injectable()
export class PlaceListEffects {
  @Effect()
  getPlaces = this.actions
    .ofType(placeListActions.GET_PLACES)
    .pipe(
      withLatestFrom(this.store.select(fromRoot.selectFilters)),
      exhaustMap(([action, state]) => this.placesService.getPlaces(state)
        .pipe(
          map(response => new placeListActions.GetPlacesSuccess(response)),
          catchError(() => of(new placeListActions.GetPlacesFailure()))
        )
      )
    );

  @Effect()
  getPlacesSuccess = this.actions
    .ofType(placeListActions.GET_PLACES_SUCCESS)
    .pipe(
      mapTo(new SearchCompleted())
    );

  @Effect()
  getPlacesFailure = this.actions
    .ofType(placeListActions.GET_PLACES_FAILURE)
    .pipe(
      mapTo(new SearchCompleted())
    );

  constructor(private store: Store<fromRoot.AppState>, private actions: Actions, private placesService: PlacesService) {}
}
