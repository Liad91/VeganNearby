import { createSelector } from '@ngrx/store';

import { AppState } from '../../store/app.reducers';
import * as fromPlaceList from '../place-list/store/place-list.reducers';
import * as fromFilters from '../filters/store/filters.reducers';

export interface FeatureState extends AppState {
  placeList: fromPlaceList.State;
}

export const selectPlaceList = (state: FeatureState) => state.placeList;
export const selectFilters = (state: FeatureState) => state.filters;
export const selectPlaceListPlaces = createSelector(selectPlaceList, (state: fromPlaceList.State) => state.places);
export const selectFiltersLocation = createSelector(selectFilters, (state: fromFilters.State) => state.location);
export const selectFiltersCategory = createSelector(selectFilters, (state: fromFilters.State) => state.selectedCategory);
export const selectFiltersCoordinates = createSelector(selectFilters, (state: fromFilters.State) => state.coordinates);
export const selectFiltersApplied = createSelector(selectFilters, (state: fromFilters.State) => {
  return state.selectedCuisines.length > 0 || state.selectedPrices.length > 0;
});
