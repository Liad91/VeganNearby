import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/withLatestFrom';

import * as fromRoot from '../../../store/app.reducers';
import * as favoritesActions from './favorites.actions';
import { PlacesService } from '../../places.service';

@Injectable()
export class FavoritesEffects {
  @Effect()
  getFavorites = this.actions
    .ofType(favoritesActions.GET_FAVORITES)
    .withLatestFrom(this.store.select(fromRoot.selectAuthUser))
    .exhaustMap(([action, user]) => this.placesService.getFavorites(user.favorites)
      .map(favorites => new favoritesActions.GetFavoritesSuccess(favorites))
      .catch(() => of(new favoritesActions.GetFavoritesFailure()))
    );

  constructor(private store: Store<fromRoot.AppState>, private actions: Actions, private placesService: PlacesService) {}
}
