import { LatLngLiteral } from '@agm/core';

import * as filtersActions from './filters.actions';
import * as Data from './../../data';

export interface Filter {
  title: string;
  alias: string;
  checked: boolean;
}

export interface State {
  location: string;
  coordinates: LatLngLiteral;
  zoom: number;
  radius: number;
  categories: Filter[];
  selectedCategory: Filter;
  prices: Filter[];
  selectedPrices: string[];
  cuisines: Filter[];
  selectedCuisines: string[];
  displayedCuisinesIndex: number[];
  limit: number;
  offset: number;
}

const initialState: State = {
  location: null,
  coordinates: null,
  zoom: 13,
  radius: 1489,
  categories: Data.categories,
  selectedCategory: null,
  prices: Data.prices,
  selectedPrices: [],
  cuisines: Data.cuisines,
  displayedCuisinesIndex: Data.displayedCuisinesIndex.slice(),
  selectedCuisines: [],
  limit: 12,
  offset: null
};

function updateSelectedArray(filterArray: string[], filter: Filter): void {
  filter.checked = !filter.checked;

  if (filter.checked) {
    filterArray.push(filter.alias);
  }
  else {
    filterArray.splice(filterArray.indexOf(filter.alias), 1);
  }
}

function resetFilters(state: State) {
  if (state.selectedPrices.length > 0) {
    state.prices.forEach(filter => filter.checked = false);
    state.selectedPrices = [];
  }
  if (state.selectedCuisines.length > 0) {
    state.cuisines.forEach(filter => filter.checked = false);
    state.selectedCuisines = [];
  }
}

function setCuisines(state: State, indexes: number[]) {
  if (state.selectedCuisines.length > 0) {
    state.cuisines.forEach(filter => filter.checked = false);
    state.selectedCuisines = [];
  }

  indexes.forEach(index => {
    state.cuisines[index].checked = true;
    state.selectedCuisines.push(state.cuisines[index].alias);

    if (state.displayedCuisinesIndex.indexOf(index) > -1) {
      state.displayedCuisinesIndex.splice(state.displayedCuisinesIndex.indexOf(index), 1);
    }
  });
  state.displayedCuisinesIndex.unshift(...indexes);
  state.displayedCuisinesIndex.splice(5, state.displayedCuisinesIndex.length);
  state.displayedCuisinesIndex.sort((a, b) => +(a > b));
}

export function filtersReducer(state = initialState, action: filtersActions.Action): State {
  switch (action.type) {
    case filtersActions.SEARCH:
      return {
        ...state,
        ...action.payload,
        zoom: initialState.zoom,
        radius: initialState.radius,
        offset: null
      };
    case filtersActions.NEW_SEARCH:
      resetFilters(state);
      return {
        ...initialState,
        ...action.payload
      };
    case filtersActions.SET_ZOOM:
      return {
        ...state,
        zoom: action.payload
      };
    case filtersActions.SET_OFFSET:
      return {
        ...state,
        offset: action.payload
      };
    case filtersActions.SET_RADIUS:
      return {
        ...state,
        radius: action.payload
      };
    case filtersActions.SET_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload
      };
    case filtersActions.SET_LOCATION:
      return {
        ...state,
        location: action.payload
      };
    case filtersActions.SET_CUISINES:
      setCuisines(state, action.payload);
      return {
        ...state
      };
    case filtersActions.SET_COORDINATES:
      return {
        ...state,
        coordinates: action.payload
      };
    case filtersActions.RESET_FILTERS:
      resetFilters(state);
      return {
        ...state
      };
    case filtersActions.UPDATE_PRICES:
      updateSelectedArray(state.selectedPrices, action.payload);
      return {
        ...state
      };
    case filtersActions.UPDATE_CUISINES:
      updateSelectedArray(state.selectedCuisines, action.payload);
      return {
        ...state
      };
    default:
      return state;
  }
}
