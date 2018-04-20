import { Action } from '@ngrx/store';

import { YelpSearchResponse } from '../../../models/yelp.model';

export const GET_PLACES = 'GET_PLACES';
export const SET_VIEW = 'SET_VIEW';
export const RESET_PLACES = 'RESET_PLACES';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_PLACES_LOADING = 'SET_PLACES_LOADING';
export const GET_PLACES_SUCCESS = 'GET_PLACES_SUCCESS';
export const GET_PLACES_FAILURE = 'GET_PLACES_FAILURE';

export class GetPlaces implements Action {
  readonly type = GET_PLACES;
}

export class SetView implements Action {
  readonly type = SET_VIEW;

  constructor(public payload: 'grid' | 'list') { }
}

export class SetPacesLoading implements Action {
  readonly type = SET_PLACES_LOADING;

  constructor(public payload: boolean) { }
}

export class ResetPlaces implements Action {
  readonly type = RESET_PLACES;
}

export class GetPlacesSuccess {
  readonly type = GET_PLACES_SUCCESS;

  constructor(public payload: YelpSearchResponse) { }
}

export class GetPlacesFailure {
  readonly type = GET_PLACES_FAILURE;
}

export type Action =
  | GetPlaces
  | SetView
  | SetPacesLoading
  | ResetPlaces
  | GetPlacesSuccess
  | GetPlacesFailure;
