import { ActionReducerMap, createSelector } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

import * as fromAuth from '../core/auth/store/auth.reducers';
import * as fromSearch from '../core/search/store/search.reducers';
import * as fromFilters from '../places/filters/store/filters.reducers';

export interface AppState {
  router: RouterReducerState;
  auth: fromAuth.State;
  search: fromSearch.State;
  filters: fromFilters.State;
}

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  auth: fromAuth.authReducer,
  search: fromSearch.searchReducer,
  filters: fromFilters.filtersReducer,
}

export const selectRouter = (state: AppState) => state.router;
export const selectAuth = (state: AppState) => state.auth;
export const selectSearch = (state: AppState) => state.search;
export const selectFilters = (state: AppState) => state.filters;
export const selectAuthUser = createSelector(selectAuth, (state: fromAuth.State) => state.user);
export const selectSearchCategory = createSelector(selectSearch, (state: fromSearch.State) => state.selectedCategory);
export const selectFiltersLocation = createSelector(selectFilters, (state: fromFilters.State) => state.location);
