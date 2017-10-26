import { Action } from '@ngrx/store';

import { YelpBusinessResponse } from '../../../models/yelp.model';

export const GET_PLACE = 'GET_PLACE';
export const SET_PLACE = 'SET_PLACE';
export const GET_PLACE_SUCCESS = 'GET_PLACE_SUCCESS';
export const GET_PLACE_FAILURE = 'GET_PLACE_FAILURE';

export class GetPlace implements Action {
  readonly type = GET_PLACE;

  constructor(public payload: string) {}
}

export class SetPlace implements Action {
  readonly type = SET_PLACE;

  constructor(public payload: YelpBusinessResponse) {}
}

export class GetPlaceSuccess implements Action {
  readonly type = GET_PLACE_SUCCESS;

  constructor(public payload: YelpBusinessResponse) {}
}

export class GetPlaceFailure implements Action {
  readonly type = GET_PLACE_FAILURE;
}

export type Action =
  | GetPlace
  | SetPlace
  | GetPlaceSuccess
  | GetPlaceFailure;
