import { ActionReducerMap } from '@ngrx/store';

import * as PlaceListActions from './place-list.actions';
import { YelpBusiness } from '../../../models/yelp.model';

export interface State {
  places: YelpBusiness[];
  total: number;
  currentPage: number;
  loading: boolean;
  error: boolean;
}

const initialState: State = {
  places: null,
  total: null,
  currentPage: 1,
  loading: false,
  error: false
};

export function placeListReducer(state = initialState, action: PlaceListActions.Action): State {
  switch (action.type) {
    case PlaceListActions.GET_PLACES:
      return {
        ...state,
        loading: true
      };
    case PlaceListActions.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case PlaceListActions.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload
      };
    case PlaceListActions.GET_PLACES_SUCCESS:
      return {
        ...state,
        places: action.payload.businesses,
        total: action.payload.total,
        loading: false,
        error: false
      };
    case PlaceListActions.GET_PLACES_FAILURE:
      return {
        ...initialState,
        error: true
      };
    default:
      return state;
  }
}
