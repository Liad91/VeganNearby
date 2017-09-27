import * as AuthActions from './auth.actions';
import { User } from './../../../models/user.model';

export interface State {
  authenticate: boolean,
  token: string,
  user: User,
  loading: boolean
}

const initialState: State = {
  authenticate: false,
  token: null,
  user: null,
  loading: false
};

export function authReducer(state = initialState, action: AuthActions.Action): State {
  switch (action.type) {
    case AuthActions.LOGIN:
    case AuthActions.REGISTER:
    case AuthActions.SOCIAL_LOGIN:
    case AuthActions.AUTHENTICATE:
     return {
       ...state,
       loading: true
     };
    case AuthActions.LOGIN_SUCCESS:
    case AuthActions.SOCIAL_LOGIN_SUCCESS:
      return {
        ...state,
        ...action.payload,
        authenticate: true,
        loading: false
      };
    case AuthActions.LOGIN_FAILURE:
      return {
        ...state,
        loading: false
      };
    case AuthActions.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
