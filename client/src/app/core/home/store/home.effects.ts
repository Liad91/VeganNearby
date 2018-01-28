import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { map, catchError, exhaustMap } from 'rxjs/operators';

import * as fromRoot from '../../../store/app.reducer';
import * as homeActions from './home.actions';
import { PlacesService } from '../../../places/places.service';

@Injectable()
export class HomeEffects {
  @Effect()
  getFavorites = this.actions
    .ofType(homeActions.GET_PLACES)
    .pipe(
      map((action: homeActions.GetPlaces) => action.payload),
      exhaustMap(payload => this.placesService.getFavorites(payload)
        .pipe(
          map(places => new homeActions.GetPlacesSuccess(places)),
          catchError(() => of(new homeActions.GetPlacesFailure()))
        )
      )
    );

  constructor(private store: Store<fromRoot.AppState>, private actions: Actions, private placesService: PlacesService) {}
}
