import * as authActions from './auth.actions';
import { User } from './../../../models/user.model';

export interface State {
  authenticate: boolean;
  token: string;
  user: User;
  loading: boolean;
  updateLoading: boolean;
  backgroundLoading: boolean;
}

const initialState: State = {
  authenticate: false,
  token: null,
  user: null,
  loading: false,
  updateLoading: false,
  backgroundLoading: false
};

export function authReducer(state = initialState, action: authActions.Action): State {
  switch (action.type) {
    case authActions.LOGIN:
    case authActions.REGISTER:
    case authActions.SOCIAL_LOGIN:
    case authActions.AUTHENTICATE:
      return {
        ...state,
        loading: true
      };
    case authActions.UPDATE:
      return {
        ...state,
        updateLoading: true
      };
    case authActions.SET_USER_BACKGROUND:
      return {
        ...state,
        backgroundLoading: true
      };
    case authActions.LOGIN_SUCCESS:
    case authActions.SOCIAL_LOGIN_SUCCESS:
      return {
        ...state,
        ...action.payload,
        authenticate: true,
        loading: false
      };
    case authActions.UPDATE_SUCCESS:
      return {
        ...state,
        ...action.payload,
        updateLoading: false
      };
    case authActions.UPDATE_FAILURE:
      return {
        ...state,
        updateLoading: false
      };
    case authActions.ERROR_OCCURRED:
      return {
        ...state,
        loading: false
      };
    case authActions.LOGOUT:
      return initialState;
    case authActions.ADD_TO_USER_FAVORITES:
      return {
        ...state,
        user: {
          ...state.user,
          favorites: state.user.favorites.concat(action.payload)
        }
      };
    case authActions.REMOVE_FROM_USER_FAVORITES:
      return {
        ...state,
        user: {
          ...state.user,
          favorites: state.user.favorites.filter(favorite => favorite !== action.payload)
        }
      };
    case authActions.SET_USER_BACKGROUND_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          background: action.payload
        },
        backgroundLoading: false
      };
    case authActions.SET_USER_BACKGROUND_FAILURE:
      return {
        ...state,
        backgroundLoading: false
      };
    default:
      return state;
  }
}
