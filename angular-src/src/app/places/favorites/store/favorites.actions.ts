import { Action } from '@ngrx/store';

import { YelpBusiness } from '../../../models/yelp.model';

export const GET_FAVORITES = 'GET_FAVORITES';
export const ADD_TO_FAVORITES = 'ADD_TO_FAVORITES';
export const REMOVE_FROM_FAVORITES = 'REMOVE_FROM_FAVORITES';
export const GET_FAVORITES_SUCCESS = 'GET_FAVORITES_SUCCESS';
export const GET_FAVORITES_FAILURE = 'GET_FAVORITES_FAILURE';

export class GetFavorites implements Action {
  readonly type = GET_FAVORITES;
}

export class AddToFavorites implements Action {
  readonly type = ADD_TO_FAVORITES;

  constructor(public payload: YelpBusiness) {}
}

export class RemoveFromFavorites implements Action {
  readonly type = REMOVE_FROM_FAVORITES;

  constructor(public payload: string) {}
}

export class GetFavoritesSuccess implements Action {
  readonly type = GET_FAVORITES_SUCCESS;

  constructor(public payload: YelpBusiness[]) {}
}

export class GetFavoritesFailure implements Action {
  readonly type = GET_FAVORITES_FAILURE;
}

export type Action =
  | GetFavorites
  | AddToFavorites
  | RemoveFromFavorites
  | GetFavoritesSuccess
  | GetFavoritesFailure;
