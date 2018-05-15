import { Action } from '@ngrx/store';

import { YelpBusinessResponse, YelpBusinessResponseError } from '../../../../models/yelp.model';

export const GET_FEATURED = 'GET_FEATURED_PLACES';
export const GET_FEATURED_SUCCESS = 'GET_FEATURED_SUCCESS';
export const GET_FEATURED_FAILURE = 'GET_FEATURED_FAILURE';

export class GetFeatured implements Action {
  readonly type = GET_FEATURED;
}

export class GetFeaturedSuccess implements Action {
  readonly type = GET_FEATURED_SUCCESS;

  constructor(public payload: Array<YelpBusinessResponse | YelpBusinessResponseError>) { }
}

export class GetFeaturedFailure implements Action {
  readonly type = GET_FEATURED_FAILURE;
}

export type Action =
  | GetFeatured
  | GetFeaturedSuccess
  | GetFeaturedFailure;
