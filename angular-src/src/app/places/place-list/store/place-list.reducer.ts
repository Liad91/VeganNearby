import { ActionReducerMap } from '@ngrx/store';

import * as PlaceListActions from './place-list.actions';
import { YelpBusiness } from '../../../models/yelp.model';

export interface State {
  places: YelpBusiness[];
  total: number;
  loading: boolean;
  error: boolean;
}

const initialState: State = {
  places: null,
  total: null,
  loading: false,
  error: false
};

export function placeListReducer(state = initialState, action: PlaceListActions.Action): State {
  switch (action.type) {
    case PlaceListActions.GET_PLACES:
      return {
        ...state,
        places: null,
        loading: true,
        error: false
      };
    case PlaceListActions.SET_PLACES_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case PlaceListActions.RESET_PLACES:
      return {
        ...initialState
      };
    case PlaceListActions.GET_PLACES_SUCCESS:
      return {
        ...state,
        places: action.payload.businesses,
        total: action.payload.total,
        loading: false
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
