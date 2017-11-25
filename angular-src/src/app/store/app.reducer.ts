import { ActionReducerMap, createSelector } from '@ngrx/store';

import * as fromAuth from '../core/auth/store/auth.reducer';
import * as fromHome from '../core/home/store/home.reducer';
import * as fromSearch from '../core/search/store/search.reducer';
import * as fromFilters from '../places/filters/store/filters.reducer';
import * as fromFavorites from '../favorites/store/favorites.reducer';

export interface AppState {
  auth: fromAuth.State;
  home: fromHome.State;
  favorites: fromFavorites.State;
  filters: fromFilters.State;
  search: fromSearch.State;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  home: fromHome.homeReducer,
  favorites: fromFavorites.favoritesReducer,
  filters: fromFilters.filtersReducer,
  search: fromSearch.searchReducer
};

export const selectAuth = (state: AppState) => state.auth;
export const selectHome = (state: AppState) => state.home;
export const selectFavorites = (state: AppState) => state.favorites;
export const selectFilters = (state: AppState) => state.filters;
export const selectSearch = (state: AppState) => state.search;

export const selectAuthUser = createSelector(selectAuth, (state: fromAuth.State) => state.user);
export const selectAuthLoading = createSelector(selectAuth, (state: fromAuth.State) => state.loading);
export const selectAuthUserLoggedIn  = createSelector(selectAuth, (state: fromAuth.State) => Boolean(state.user));
export const selectAuthUserFavoritesLength  = createSelector(selectAuth, (state: fromAuth.State) => state.user.favorites.length);
export const selectAuthUserBackgroundLoading  = createSelector(selectAuth, (state: fromAuth.State) => state.backgroundLoading);
export const selectFiltersLocation = createSelector(selectFilters, (state: fromFilters.State) => state.location);
export const selectSearchselectedCategory = createSelector(selectSearch, (state: fromSearch.State) => {
  return state.categories[state.selectedCategoryIndex];
});

export function favoriteFactory(id: string) {
  return createSelector(selectAuth, (state: fromAuth.State) => {
    if (state.user) {
      return state.user.favorites.indexOf(id) > -1;
    }
    return false;
  });
}
