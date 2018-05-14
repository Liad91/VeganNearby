import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';

import { PlacesService } from '../../../places.service';
import * as placeDetailActions from './place-detail.actions';

@Injectable()
export class PlaceDetailEffects {
  @Effect()
  getPlace = this.actions.pipe(
    ofType(placeDetailActions.GET_PLACE),
    map((action: placeDetailActions.GetPlace) => action.payload),
    exhaustMap(id => this.placesService.getPlaceDetail(id)
      .pipe(
        map(results => new placeDetailActions.GetPlaceSuccess(results)),
        catchError(() => of(new placeDetailActions.GetPlaceFailure()))
      )
    )
  );

  @Effect()
  setPlace = this.actions.pipe(
    ofType(placeDetailActions.SET_PLACE),
    map((action: placeDetailActions.SetPlace) => action.payload.id),
    exhaustMap(id => this.placesService.getReviewsById(id)
      .pipe(
        map(reviews => new placeDetailActions.GetReviewsSuccess(reviews)),
        catchError(() => of(new placeDetailActions.GetReviewsFailure()))
      )
    )
  );

  @Effect()
  getReviews = this.actions.pipe(
    ofType(placeDetailActions.GET_REVIEWS),
    map((action: placeDetailActions.GetReviews) => action.payload),
    exhaustMap(id => this.placesService.getReviewsById(id)
      .pipe(
        map(reviews => new placeDetailActions.GetReviewsSuccess(reviews)),
        catchError(() => of(new placeDetailActions.GetReviewsFailure()))
      )
    )
  );

  constructor(private actions: Actions, private placesService: PlacesService) { }
}
