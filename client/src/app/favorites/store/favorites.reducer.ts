import { YelpBusinessResponse, YelpBusinessResponseError } from '../../models/yelp.model';

import * as favoritesActions from './favorites.actions';

export interface State {
  total: number;
  favorites: YelpBusinessResponse[];
  emptyFavorites: YelpBusinessResponseError[];
  loading: 'favorites' | 'emptyFavorites';
  error: boolean;
}

const initialState = {
  total: 0,
  favorites: [],
  emptyFavorites: [],
  loading: null,
  error: false,
};

function favoritesResolver(response) {
  const favorites: YelpBusinessResponse[] = [];
  const emptyFavorites: YelpBusinessResponseError[] = [];

  response.map(favorite => {
    if (favorite.error) {
      emptyFavorites.push(favorite);
    }
    else {
      favorites.push(favorite);
    }
  });

  return {
    total: response.length,
    favorites, emptyFavorites,
    error: response.length === emptyFavorites.length
  };
}

export function favoritesReducer(state = initialState, action: favoritesActions.Action): State {
  switch (action.type) {
    case favoritesActions.GET_FAVORITES:
      return {
        ...state,
        loading: 'favorites'
      };
    case favoritesActions.ADD_TO_FAVORITES:
      return {
        ...state,
        favorites: state.favorites.concat(action.payload)
      };
    case favoritesActions.REMOVE_FROM_FAVORITES:
      const favorites = state.favorites.filter(favorite => favorite.id !== action.payload);

      return {
        ...state,
        favorites,
        total: favorites.length + state.emptyFavorites.length
      };
    case favoritesActions.REMOVE_FROM_EMPTY_FAVORITES:
      const emptyFavorites = state.emptyFavorites.filter(favorite => favorite.id !== action.payload);

      return {
        ...state,
        emptyFavorites,
        total: emptyFavorites.length + state.favorites.length
      };
    case favoritesActions.GET_FAVORITES_SUCCESS:
      return {
        ...favoritesResolver([...state.favorites, ...action.payload]),
        loading: null,
        error: false
      };
    case favoritesActions.GET_FAVORITES_FAILURE:
      return {
        ...state,
        loading: null,
        error: true
      };
    case favoritesActions.RELOAD_EMPTY_FAVORITES:
      return {
        ...state,
        loading: 'emptyFavorites'
      };
    case favoritesActions.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case favoritesActions.RESET_FAVORITES:
      return initialState;
    default:
      return state;
  }
}
