import { YelpBusinessResponse } from '../../../../models/yelp.model';
import * as homeActions from './home.actions';

export interface State {
  featured: YelpBusinessResponse[];
  loading: boolean;
  error: boolean;
}

const initialState: State = {
  featured: [],
  loading: false,
  error: false
};

function featuredResolver(response) {
  const featured = response.filter(featuredPlace => !featuredPlace.error);

  return { featured };
}

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
        ...featuredResolver(action.payload),
        error: false,
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
