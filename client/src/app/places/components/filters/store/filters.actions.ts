import { LatLngLiteral } from '@agm/core';
import { Action } from '@ngrx/store';

import { Filter } from './../../../../models/filter.model';

export const SEARCH = 'SEARCH';
export const NEW_SEARCH = 'NEW_SEARCH';
export const SET_ZOOM = 'SET_ZOOM';
export const SET_OFFSET = 'SET_OFFSET';
export const SET_RADIUS = 'SET_RADIUS';
export const SET_CATEGORY = 'SET_CATEGORY';
export const SET_LOCATION = 'SET_LOCATION';
export const SET_CUISINES = 'SET_CUISINES';
export const SET_COORDINATES = 'SET_COORDINATES';
export const RESET_FILTERS = 'RESET_FILTERS';
export const UPDATE_PRICES = 'UPDATE_PRICES';
export const UPDATE_CUISINES = 'UPDATE_CUISINES';

export class Search implements Action {
  readonly type = SEARCH;

  constructor(public payload: { location: string, coordinates: LatLngLiteral }) { }
}

export class NewSearch implements Action {
  readonly type = NEW_SEARCH;

  constructor(public payload: { location: string, coordinates?: LatLngLiteral, selectedCategory?: Filter }) { }
}

export class SetZoom implements Action {
  readonly type = SET_ZOOM;

  constructor(public payload: number) { }
}

export class SetOffset implements Action {
  readonly type = SET_OFFSET;

  constructor(public payload: number) { }
}

export class SetRadius implements Action {
  readonly type = SET_RADIUS;

  constructor(public payload: number) { }
}

export class SetCategory implements Action {
  readonly type = SET_CATEGORY;

  constructor(public payload: Filter) { }
}

export class SetLocation implements Action {
  readonly type = SET_LOCATION;

  constructor(public payload: string) { }
}

export class SetCuisines implements Action {
  readonly type = SET_CUISINES;

  constructor(public payload: string[]) { }
}

export class SetCoordinates implements Action {
  readonly type = SET_COORDINATES;

  constructor(public payload: LatLngLiteral) { }
}

export class ResetFilters implements Action {
  readonly type = RESET_FILTERS;
}

export class UpdatePrices implements Action {
  readonly type = UPDATE_PRICES;

  constructor(public payload: Filter) { }
}

export class UpdateCuisines implements Action {
  readonly type = UPDATE_CUISINES;

  constructor(public payload: Filter) { }
}

export type Action =
  | Search
  | NewSearch
  | SetZoom
  | SetOffset
  | SetRadius
  | SetCategory
  | SetLocation
  | SetCuisines
  | SetCoordinates
  | ResetFilters
  | UpdatePrices
  | UpdateCuisines;
