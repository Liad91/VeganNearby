import * as homeActions from './home.actions';

import { YelpBusinessResponse } from '../../../models/yelp.model';

export interface State {
  places: YelpBusinessResponse[]
  loading: boolean;
  error: boolean;
}

const initialState: State = {
  places: null,
  loading: false,
  error: false
};

export function homeReducer(state = initialState, action: homeActions.Action): State {
  switch (action.type) {
    case homeActions.GET_PLACES:
      return {
        ...state,
        loading: true,
        error: false
      };
    case homeActions.GET_PLACE_SUCCESS:
      return {
        ...state,
        places: action.payload,
        loading: false
      };
    case homeActions.GET_PLACE_FAILURE:
      return {
        ...state,
        loading: false,
        error: true
      };
    default:
      return state;
  }
}
