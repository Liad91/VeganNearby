import { Action } from '@ngrx/store';

import { State } from '../../filters/store/filters.reducers'
import { YelpSearchResponse } from '../../../models/yelp.model';

export const GET_PLACES = 'GET_PLACES';
export const SET_LOADING = 'SET_LOADING';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const GET_PLACES_SUCCESS = 'GET_PLACES_SUCCESS';
export const GET_PLACES_FAILURE = 'GET_PLACES_FAILURE';

export class GetPlaces implements Action {
  readonly type = GET_PLACES;
}

export class SetLoading implements Action {
  readonly type = SET_LOADING;

  constructor(public payload: boolean) {}
}

export class SetCurrentPage implements Action {
  readonly type = SET_CURRENT_PAGE;

  constructor(public payload: number) {}
}

export class GetPlacesSuccess {
  readonly type = GET_PLACES_SUCCESS;

  constructor(public payload: YelpSearchResponse) {}
}

export class GetPlacesFailure {
  readonly type = GET_PLACES_FAILURE;
}

export type Action =
  | GetPlaces
  | SetLoading
  | SetCurrentPage
  | GetPlacesSuccess
  | GetPlacesFailure;
