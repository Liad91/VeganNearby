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

interface StateProps {
  prices?: Filter[];
  selectedPrices?: string[];
  cuisines?: Filter[];
  selectedCuisines?: string[];
  displayedCuisinesIndex?: number[];
}

const initialState: State = {
  location: null,
  coordinates: null,
  zoom: 12,
  radius: 1489,
  categories: Data.categories,
  selectedCategory: Data.categories[0],
  prices: Data.prices,
  selectedPrices: [],
  cuisines: Data.cuisines,
  displayedCuisinesIndex: Data.displayedCuisinesIndex.slice(),
  selectedCuisines: [],
  limit: 18,
  offset: null
};

function updateSelectedArray(filterArray: string[], filter: Filter): string[] {
  filter.checked = !filter.checked;

  if (filter.checked) {
    return filterArray.concat(filter.alias);
  }
  else {
    return filterArray.filter(value => value !== filter.alias);
  }
}

function resetFilters(state: State): StateProps {
  const props: StateProps = {};

  if (state.selectedPrices.length > 0) {
    props.selectedPrices = [];
    props.prices = state.prices.map(price => {
      return {
        ...price,
        checked: false
      };
    });
  }

  if (state.selectedCuisines.length > 0) {
    state.selectedCuisines = [];
    props.cuisines = state.cuisines.map(cuisine => {
      return {
        ...cuisine,
        checked: false
      };
    });
  }
  return props;
}

function setCuisines(state: State, indexes: number[]): StateProps {
  const props: StateProps = {
    displayedCuisinesIndex: state.displayedCuisinesIndex.slice(),
    selectedCuisines: state.selectedCuisines.slice(),
    cuisines: state.cuisines.map(cuisine => {
      return { ...cuisine };
    })
  };

  if (state.selectedCuisines.length > 0) {
    props.selectedCuisines = [];
    props.cuisines = state.cuisines.map(cuisine => {
      return {
        ...cuisine,
        checked: false
      };
    });
  }

  indexes.forEach(index => {
    props.cuisines[index].checked = true;
    props.selectedCuisines.push(props.cuisines[index].alias);

    if (props.displayedCuisinesIndex.indexOf(index) > -1) {
      props.displayedCuisinesIndex.splice(props.displayedCuisinesIndex.indexOf(index), 1);
    }
  });

  props.displayedCuisinesIndex.unshift(...indexes);
  props.displayedCuisinesIndex.splice(5, props.displayedCuisinesIndex.length);
  props.displayedCuisinesIndex.sort((a, b) => Number(a > b));

  return props;
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
      return {
        ...initialState,
        ...resetFilters(state),
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
      return {
        ...state,
        ...setCuisines(state, action.payload)
      };
    case filtersActions.SET_COORDINATES:
      return {
        ...state,
        coordinates: action.payload
      };
    case filtersActions.RESET_FILTERS:
      return {
        ...state,
        ...resetFilters(state)
      };
    case filtersActions.UPDATE_PRICES:
      return {
        ...state,
        selectedPrices: updateSelectedArray(state.selectedPrices, action.payload)
      };
    case filtersActions.UPDATE_CUISINES:
      return {
        ...state,
        selectedCuisines: updateSelectedArray(state.selectedCuisines, action.payload)
      };
    default:
      return state;
  }
}
