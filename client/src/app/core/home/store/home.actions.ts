import { Action } from '@ngrx/store';

import { YelpBusinessResponse } from '../../../models/yelp.model';

export const GET_PLACES = '[HOME] GET_PLACES';
export const GET_PLACE_SUCCESS = '[HOME] GET_PLACE_SUCCESS';
export const GET_PLACE_FAILURE = '[HOME] GET_PLACE_FAILURE';

export class GetPlaces implements Action {
  readonly type = GET_PLACES;

  constructor(public payload: string[]) {}
}

export class GetPlacesSuccess implements Action {
  readonly type = GET_PLACE_SUCCESS;

  constructor(public payload: YelpBusinessResponse[]) {}
}

export class GetPlacesFailure implements Action {
  readonly type = GET_PLACE_FAILURE;
}

export type Action =
  | GetPlaces
  | GetPlacesSuccess
  | GetPlacesFailure;
