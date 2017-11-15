import { Filter } from '../../../places/filters/store/filters.reducer';
import { categories } from '../../../places/data';
import * as searchActions from './search.actions';

export interface State {
  location: string;
  categories: Filter[];
  selectedCategoryIndex: number;
  loading: boolean;
}

const initialState: State = {
  location: null,
  categories: categories,
  selectedCategoryIndex: 0,
  loading: false
};

export function searchReducer(state = initialState, action: searchActions.Action): State {
  switch (action.type) {
    case searchActions.SET_SEARCH_CATEGORY:
      return {
        ...state,
        selectedCategoryIndex: action.payload
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
