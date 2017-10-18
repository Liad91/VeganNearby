import { Filter } from '../../../places/filters/store/filters.reducers';
import { categories } from '../../../places/data';
import * as searchActions from './search.actions';

export interface State {
  location: string;
  categories: Filter[];
  selectedCategory: Filter;
  loading: boolean;
}

const initialState: State = {
  location: null,
  categories: categories,
  selectedCategory: categories[0],
  loading: false
};

export function searchReducer(state = initialState, action: searchActions.Action): State {
  switch (action.type) {
    case searchActions.SET_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload
      };
    case searchActions.NAV_SEARCH:
    case searchActions.HOME_SEARCH:
      return {
        ...state,
        loading: true
      };
    case searchActions.SEARCH_COMPLETED:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
}
