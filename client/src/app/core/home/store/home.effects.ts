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
  getFeatured = this.actions
    .ofType(homeActions.GET_FEATURED)
    .pipe(
      exhaustMap(() => this.placesService.getFeaturedPlaces()
        .pipe(
          map(places => new homeActions.GetFeaturedSuccess(places)),
          catchError(() => of(new homeActions.GetFeaturedFailure()))
        )
      )
    );

  constructor(private store: Store<fromRoot.AppState>, private actions: Actions, private placesService: PlacesService) { }
}
