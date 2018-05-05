import * as homeActions from './home.actions';

import { YelpBusinessResponse } from '../../../models/yelp.model';

export interface State {
  featured: YelpBusinessResponse[];
  loading: boolean;
  error: boolean;
}

const initialState: State = {
  featured: null,
  loading: false,
  error: false
};

export function homeReducer(state = initialState, action: homeActions.Action): State {
  switch (action.type) {
    case homeActions.GET_FEATURED:
      return {
        ...state,
        loading: true,
        error: false
      };
    case homeActions.GET_FEATURED_SUCCESS:
      return {
        ...state,
        featured: action.payload,
        loading: false
      };
    case homeActions.GET_FEATURED_FAILURE:
      return {
        ...state,
        loading: false,
        error: true
      };
    default:
      return state;
  }
}
