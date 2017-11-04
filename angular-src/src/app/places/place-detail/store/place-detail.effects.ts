import { YelpReviewsResponse } from '../../../models/yelp.model';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/exhaustMap';

import * as placeDetailActions from './place-detail.actions';
import { PlacesService } from '../../places.service';

@Injectable()
export class PlaceDetailEffects {
  @Effect()
  getPlace = this.actions
    .ofType(placeDetailActions.GET_PLACE)
    .map((action: placeDetailActions.GetPlace) => action.payload)
    .exhaustMap(id =>  this.placesService.getPlaceDetail(id)
      .map(results => new placeDetailActions.GetPlaceSuccess(results))
      .catch(() => of(new placeDetailActions.GetPlaceFailure()))
    );

  @Effect()
  setPlace = this.actions
    .ofType(placeDetailActions.SET_PLACE)
    .map((action: placeDetailActions.SetPlace) => action.payload.id)
    .exhaustMap(id =>  this.placesService.getReviewsById(id)
      .map(reviews => new placeDetailActions.GetReviewsSuccess(reviews))
      .catch(() => of(new placeDetailActions.GetReviewsFailure()))
    );

  @Effect()
  getReviews = this.actions
    .ofType(placeDetailActions.GET_REVIEWS)
    .map((action: placeDetailActions.GetReviews) => action.payload)
    .exhaustMap(id =>  this.placesService.getReviewsById(id)
      .map(reviews => new placeDetailActions.GetReviewsSuccess(reviews))
      .catch(() => of(new placeDetailActions.GetReviewsFailure()))
    );

  constructor(private actions: Actions, private placesService: PlacesService) {}
}
