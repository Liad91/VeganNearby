import { Action } from '@ngrx/store';

import { YelpBusinessResponse, YelpReviewsResponse } from '../../../../models/yelp.model';

export const GET_PLACE = 'GET_PLACE';
export const SET_PLACE = 'SET_PLACE';
export const GET_REVIEWS = 'GET_REVIEWS';
export const GET_PLACE_SUCCESS = 'GET_PLACE_SUCCESS';
export const GET_PLACE_FAILURE = 'GET_PLACE_FAILURE';
export const GET_REVIEWS_SUCCESS = 'GET_REVIEWS_SUCCESS';
export const GET_REVIEWS_FAILURE = 'GET_REVIEWS_FAILURE';

export class GetPlace implements Action {
  readonly type = GET_PLACE;

  constructor(public payload: string) { }
}

export class SetPlace implements Action {
  readonly type = SET_PLACE;

  constructor(public payload: YelpBusinessResponse) { }
}

export class GetReviews implements Action {
  readonly type = GET_REVIEWS;

  constructor(public payload: string) { }
}

export class GetPlaceSuccess implements Action {
  readonly type = GET_PLACE_SUCCESS;

  constructor(public payload: (YelpBusinessResponse | YelpReviewsResponse)[]) { }
}

export class GetPlaceFailure implements Action {
  readonly type = GET_PLACE_FAILURE;
}

export class GetReviewsSuccess implements Action {
  readonly type = GET_REVIEWS_SUCCESS;

  constructor(public payload: YelpReviewsResponse) { }
}

export class GetReviewsFailure implements Action {
  readonly type = GET_REVIEWS_FAILURE;
}

export type Action =
  | GetPlace
  | SetPlace
  | GetReviews
  | GetPlaceSuccess
  | GetPlaceFailure
  | GetReviewsSuccess
  | GetReviewsFailure;
