import { createSelector } from '@ngrx/store';

import { AppState } from '../../store/app.reducer';
import * as fromPlaceList from '../place-list/store/place-list.reducer';
import * as fromPlaceDetail from '../place-detail/store/place-detail.reducer';
import * as fromFilters from '../filters/store/filters.reducer';

export interface FeatureState extends AppState {
  placeList: fromPlaceList.State;
  placeDetail: fromPlaceDetail.State;
}

export const selectFilters = (state: FeatureState) => state.filters;
export const selectPlaceList = (state: FeatureState) => state.placeList;
export const selectPlaceDetail = (state: FeatureState) => state.placeDetail;

export const selectFiltersLocation = createSelector(selectFilters, (state: fromFilters.State) => state.location);
export const selectFiltersCuisines = createSelector(selectFilters, (state: fromFilters.State) => state.cuisines);
export const selectFiltersDisplayedCuisines = createSelector(selectFilters, (state: fromFilters.State) => state.displayedCuisinesIndex);
