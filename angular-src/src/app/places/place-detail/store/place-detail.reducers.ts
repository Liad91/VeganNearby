import { YelpBusinessResponse } from '../../../models/yelp.model';

import * as placeDetailActions from './place-detail.actions';

export interface State {
  place: YelpBusinessResponse,
  loading: boolean,
  error: boolean
}

const initialState = {
  place: null,
  loading: true,
  error: false
};

export function placeDetailReducer(state = initialState, action: placeDetailActions.Action): State {
  switch (action.type) {
    case placeDetailActions.GET_PLACE:
      return {
        ...state,
        loading: true,
        error: false
      };
    case placeDetailActions.GET_PLACE_SUCCESS:
      return {
        ...state,
        place: action.payload,
        loading: false
      };
    case placeDetailActions.GET_PLACE_FAILURE:
      return {
        ...state,
        loading: false,
        error: true
      }
    default:
      return state;
  }
}
