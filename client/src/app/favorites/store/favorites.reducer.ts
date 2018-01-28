import { YelpBusinessResponse } from '../../models/yelp.model';

import * as favoritesActions from './favorites.actions';

export interface State {
  places: YelpBusinessResponse[];
  loading: boolean;
  error: boolean;
}

const initialState = {
  places: [],
  loading: false,
  error: false
};

function removeFromFavorites(state: State, id: string) {
  const index = state.places.findIndex(place => place.id === id);

  state.places.splice(index, 1);
}

export function favoritesReducer(state = initialState, action: favoritesActions.Action): State {
  switch (action.type) {
    case favoritesActions.GET_FAVORITES:
      return {
        ...state,
        loading: true
      };
    case favoritesActions.ADD_TO_FAVORITES:
      state.places.push(action.payload);
      return {
        ...state
      };
    case favoritesActions.REMOVE_FROM_FAVORITES:
      removeFromFavorites(state, action.payload);
      return {
        ...state
      };
    case favoritesActions.GET_FAVORITES_SUCCESS:
      return {
        places: action.payload,
        loading: false,
        error: false
      };
    case favoritesActions.GET_FAVORITES_FAILURE:
      return {
        ...state,
        loading: false,
        error: true
      };
    case favoritesActions.RESET_FAVORITES:
      return initialState;
    default:
      return state;
  }
}
