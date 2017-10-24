import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/exhaustMap';

import * as placeDetailActions from './place-detail.actions';
import { PlacesService } from '../../places.service';

@Injectable()
export class PlaceDetailEffects {
  @Effect()
  GetPlace = this.actions
    .ofType(placeDetailActions.GET_PLACE)
    .exhaustMap((action: placeDetailActions.GetPlace) =>  this.placesService.getPlaceById(action.payload)
      .map(place => new placeDetailActions.GetPlaceSuccess(place))
      .catch(() => of(new placeDetailActions.GetPlaceFailure()))
    );

  constructor(private actions: Actions, private placesService: PlacesService) {}
}
