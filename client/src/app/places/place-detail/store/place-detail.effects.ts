import { YelpReviewsResponse } from '../../../models/yelp.model';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, catchError, exhaustMap } from 'rxjs/operators';

import * as placeDetailActions from './place-detail.actions';
import { PlacesService } from '../../places.service';

@Injectable()
export class PlaceDetailEffects {
  @Effect()
  getPlace = this.actions
    .ofType(placeDetailActions.GET_PLACE)
    .pipe(
      map((action: placeDetailActions.GetPlace) => action.payload),
      exhaustMap(id =>  this.placesService.getPlaceDetail(id)
        .pipe(
          map(results => new placeDetailActions.GetPlaceSuccess(results)),
          catchError(() => of(new placeDetailActions.GetPlaceFailure()))
        )
      )
    );

  @Effect()
  setPlace = this.actions
    .ofType(placeDetailActions.SET_PLACE)
    .pipe(
      map((action: placeDetailActions.SetPlace) => action.payload.id),
      exhaustMap(id =>  this.placesService.getReviewsById(id)
        .pipe(
          map(reviews => new placeDetailActions.GetReviewsSuccess(reviews)),
          catchError(() => of(new placeDetailActions.GetReviewsFailure()))
        )
      )
    );

  @Effect()
  getReviews = this.actions
    .ofType(placeDetailActions.GET_REVIEWS)
    .pipe(
      map((action: placeDetailActions.GetReviews) => action.payload),
      exhaustMap(id =>  this.placesService.getReviewsById(id)
        .pipe(
          map(reviews => new placeDetailActions.GetReviewsSuccess(reviews)),
          catchError(() => of(new placeDetailActions.GetReviewsFailure()))
        )
      )
    );

  constructor(private actions: Actions, private placesService: PlacesService) {}
}
