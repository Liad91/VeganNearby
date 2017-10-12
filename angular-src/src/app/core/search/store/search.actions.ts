import { LatLngLiteral } from '@agm/core';
import { Action } from '@ngrx/store';

import { Filter } from '../../../places/filters/store/filters.reducers';

export const NAV_SEARCH = 'NAV_SEARCH';
export const HOME_SEARCH = 'HOME_SEARCH';
export const SET_CATEGORY = 'SET_CATEGORY';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';

export class NavSearch implements Action {
  readonly type = NAV_SEARCH;

  constructor(public payload: string) {}
}

export class HomeSearch implements Action {
  readonly type = HOME_SEARCH;

  constructor(public payload: { location: string, coordinates: LatLngLiteral, selectedCategory: Filter }) {}
}

export class SetCategory implements Action {
  readonly type = SET_CATEGORY;

  constructor(public payload: Filter) {}
}

export class SearchSuccess implements Action {
  readonly type = SEARCH_SUCCESS;
}

export type Action =
  | NavSearch
  | HomeSearch
  | SetCategory
  | SearchSuccess;
