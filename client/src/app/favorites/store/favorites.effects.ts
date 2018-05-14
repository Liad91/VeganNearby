import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, withLatestFrom } from 'rxjs/operators';

import { PlacesService } from '../../places/places.service';
import * as fromRoot from '../../store/app.reducer';
import * as favoritesActions from './favorites.actions';

@Injectable()
export class FavoritesEffects {
  @Effect()
  getFavorites = this.actions.pipe(
    ofType(favoritesActions.GET_FAVORITES),
    withLatestFrom(this.store.select(fromRoot.selectAuthUser)),
    exhaustMap(([action, user]) => this.placesService.getPlacesById(user.favorites)
      .pipe(
        map(favorites => new favoritesActions.GetFavoritesSuccess(favorites)),
        catchError(() => of(new favoritesActions.GetFavoritesFailure()))
      )
    )
  );

  constructor(private store: Store<fromRoot.AppState>, private actions: Actions, private placesService: PlacesService) { }
}
