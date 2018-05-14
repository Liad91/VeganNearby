import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';

import { PlacesService } from '../../../../places/places.service';
import * as fromRoot from '../../../../store/app.reducer';
import * as homeActions from './home.actions';

@Injectable()
export class HomeEffects {
  @Effect()
  getFeatured = this.actions.pipe(
    ofType(homeActions.GET_FEATURED),
    exhaustMap(() => this.placesService.getFeaturedPlaces()
      .pipe(
        map(places => new homeActions.GetFeaturedSuccess(places)),
        catchError(() => of(new homeActions.GetFeaturedFailure()))
      )
    )
  );

  constructor(private store: Store<fromRoot.AppState>, private actions: Actions, private placesService: PlacesService) { }
}
