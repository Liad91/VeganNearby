import { Action } from '@ngrx/store';

import { YelpBusinessResponse, YelpBusinessResponseError } from '../../models/yelp.model';

export const GET_FAVORITES = 'GET_FAVORITES';
export const ADD_TO_FAVORITES = 'ADD_TO_FAVORITES';
export const REMOVE_FROM_FAVORITES = 'REMOVE_FROM_FAVORITES';
export const REMOVE_FROM_EMPTY_FAVORITES = 'REMOVE_FROM_EMPTY_FAVORITES';
export const GET_FAVORITES_SUCCESS = 'GET_FAVORITES_SUCCESS';
export const GET_FAVORITES_FAILURE = 'GET_FAVORITES_FAILURE';
export const RESET_FAVORITES = 'RESET_FAVORITES';
export const RELOAD_EMPTY_FAVORITES = 'RELOAD_EMPTY_FAVORITES';
export const SET_LOADING = 'SET_LOADING';

export class GetFavorites implements Action {
  readonly type = GET_FAVORITES;
}

export class AddToFavorites implements Action {
  readonly type = ADD_TO_FAVORITES;

  constructor(public payload: YelpBusinessResponse) { }
}

export class RemoveFromFavorites implements Action {
  readonly type = REMOVE_FROM_FAVORITES;

  constructor(public payload: string) { }
}

export class RemoveFromEmptyFavorites implements Action {
  readonly type = REMOVE_FROM_EMPTY_FAVORITES;

  constructor(public payload: string) { }
}

export class GetFavoritesSuccess implements Action {
  readonly type = GET_FAVORITES_SUCCESS;

  constructor(public payload: Array<YelpBusinessResponse | YelpBusinessResponseError>) { }
}

export class GetFavoritesFailure implements Action {
  readonly type = GET_FAVORITES_FAILURE;
}

export class ResetFavorites implements Action {
  readonly type = RESET_FAVORITES;
}

export class ReloadEmptyFavorites implements Action {
  readonly type = RELOAD_EMPTY_FAVORITES;

  constructor(public payload: string[]) { }
}

export class SetLoading implements Action {
  readonly type = SET_LOADING;

  constructor(public payload: 'favorites' | 'emptyFavorites') { }
}

export type Action =
  | GetFavorites
  | AddToFavorites
  | RemoveFromFavorites
  | RemoveFromEmptyFavorites
  | GetFavoritesSuccess
  | GetFavoritesFailure
  | ResetFavorites
  | ReloadEmptyFavorites
  | SetLoading;
