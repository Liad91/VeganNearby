import { Action } from '@ngrx/store';

import { YelpBusinessResponse } from '../../models/yelp.model';

export const GET_FAVORITES = 'GET_FAVORITES';
export const ADD_TO_FAVORITES = 'ADD_TO_FAVORITES';
export const REMOVE_FROM_FAVORITES = 'REMOVE_FROM_FAVORITES';
export const GET_FAVORITES_SUCCESS = 'GET_FAVORITES_SUCCESS';
export const GET_FAVORITES_FAILURE = 'GET_FAVORITES_FAILURE';
export const RESET_FAVORITES = 'RESET_FAVORITES';

export class GetFavorites implements Action {
  readonly type = GET_FAVORITES;
}

export class AddToFavorites implements Action {
  readonly type = ADD_TO_FAVORITES;

  constructor(public payload: YelpBusinessResponse) {}
}

export class RemoveFromFavorites implements Action {
  readonly type = REMOVE_FROM_FAVORITES;

  constructor(public payload: string) {}
}

export class GetFavoritesSuccess implements Action {
  readonly type = GET_FAVORITES_SUCCESS;

  constructor(public payload: YelpBusinessResponse[]) {}
}

export class GetFavoritesFailure implements Action {
  readonly type = GET_FAVORITES_FAILURE;
}

export class ResetFavorites implements Action {
  readonly type = RESET_FAVORITES;
}

export type Action =
  | GetFavorites
  | AddToFavorites
  | RemoveFromFavorites
  | GetFavoritesSuccess
  | GetFavoritesFailure
  | ResetFavorites;
