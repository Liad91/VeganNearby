import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { map, catchError, exhaustMap, withLatestFrom } from 'rxjs/operators';

import * as fromRoot from '../../store/app.reducer';
import * as favoritesActions from './favorites.actions';
import { PlacesService } from '../../places/places.service';

@Injectable()
export class FavoritesEffects {
  @Effect()
  getFavorites = this.actions
    .ofType(favoritesActions.GET_FAVORITES)
    .pipe(
      withLatestFrom(this.store.select(fromRoot.selectAuthUser)),
      exhaustMap(([action, user]) => this.placesService.getFavorites(user.favorites)
        .pipe(
          map(favorites => new favoritesActions.GetFavoritesSuccess(favorites)),
          catchError(() => of(new favoritesActions.GetFavoritesFailure()))
        )
      )
    );

  constructor(private store: Store<fromRoot.AppState>, private actions: Actions, private placesService: PlacesService) {}
}
