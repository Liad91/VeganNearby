import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/exhaustMap';

import * as fromRoot from '../../../store/app.reducers';
import * as homeActions from './home.actions';
import { PlacesService } from '../../../places/places.service';

@Injectable()
export class HomeEffects {
  @Effect()
  getFavorites = this.actions
    .ofType(homeActions.GET_PLACES)
    .map((action: homeActions.GetPlaces) => action.payload)
    .exhaustMap(payload => this.placesService.getFavorites(payload)
      .map(places => new homeActions.GetPlacesSuccess(places))
      .catch(() => of(new homeActions.GetPlacesFailure()))
    );

  constructor(private store: Store<fromRoot.AppState>, private actions: Actions, private placesService: PlacesService) {}
}
