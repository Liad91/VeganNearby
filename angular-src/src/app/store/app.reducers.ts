import { ActionReducerMap, createSelector } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

import * as fromAuth from '../core/auth/store/auth.reducers';
import * as fromSearch from '../core/search/store/search.reducers';
import * as fromFilters from '../places/filters/store/filters.reducers';
import * as fromFavorites from '../places/favorites/store/favorites.reducers';

export interface AppState {
  router: RouterReducerState;
  auth: fromAuth.State;
  search: fromSearch.State;
  filters: fromFilters.State;
  favorites: fromFavorites.State
}

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  auth: fromAuth.authReducer,
  search: fromSearch.searchReducer,
  filters: fromFilters.filtersReducer,
  favorites: fromFavorites.favoritesReducer
}

export const selectRouter = (state: AppState) => state.router;
export const selectAuth = (state: AppState) => state.auth;
export const selectSearch = (state: AppState) => state.search;
export const selectFilters = (state: AppState) => state.filters;
export const selectFavorites = (state: AppState) => state.favorites;

export const selectAuthUser = createSelector(selectAuth, (state: fromAuth.State) => state.user);
export const selectAuthLoading = createSelector(selectAuth, (state: fromAuth.State) => state.loading);
export const selectAuthUserLoggedIn  = createSelector(selectAuth, (state: fromAuth.State) => Boolean(state.user));
export const selectAuthUserFavoritesLength  = createSelector(selectAuth, (state: fromAuth.State) => state.user.favorites.length);
export const selectAuthUserBackgroundLoading  = createSelector(selectAuth, (state: fromAuth.State) => state.backgroundLoading);
export const selectFiltersLocation = createSelector(selectFilters, (state: fromFilters.State) => state.location);
export const selectSearchCategories = createSelector(selectSearch, (state: fromSearch.State) => state.categories);
export const selectSearchselectedCategory = createSelector(selectSearch, (state: fromSearch.State) => {
  return state.categories[state.selectedCategoryIndex]
});

export function favoriteFactory(id: string) {
  return createSelector(selectAuth, (state: fromAuth.State) => {
    if (state.user) {
      return state.user.favorites.indexOf(id) > -1;
    }
    return false;
  });
};
