import { YelpBusinessResponse, YelpReviewsResponse } from '../../../models/yelp.model';

import * as placeDetailActions from './place-detail.actions';

export interface State {
  place: YelpBusinessResponse;
  reviews: YelpReviewsResponse;
  loading: string;
  error: string;
}

const initialState = {
  place: null,
  reviews: null,
  loading: null,
  error: null
};

export function placeDetailReducer(state = initialState, action: placeDetailActions.Action): State {
  switch (action.type) {
    case placeDetailActions.GET_PLACE:
      return {
        ...state,
        loading: 'page',
        error: null
      };
    case placeDetailActions.SET_PLACE:
      return {
        ...state,
        place: action.payload,
        loading: 'reviews',
        error: null
      };
    case placeDetailActions.GET_REVIEWS:
      return {
        ...state,
        loading: 'reviews',
        error: null
      };
    case placeDetailActions.GET_PLACE_SUCCESS:
      return {
        ...state,
        place: (action.payload[0] as YelpBusinessResponse),
        reviews: (action.payload[1] as YelpReviewsResponse),
        loading: null
      };
    case placeDetailActions.GET_PLACE_FAILURE:
      return {
        ...state,
        loading: null,
        error: 'page'
      };
    case placeDetailActions.GET_REVIEWS_SUCCESS:
      return {
        ...state,
        reviews: action.payload,
        loading: null
      };
    case placeDetailActions.GET_REVIEWS_FAILURE:
      return {
        ...state,
        loading: null,
        error: 'reviews'
      };
    default:
      return state;
  }
}
