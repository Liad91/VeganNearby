import { Action } from '@ngrx/store';

import { User } from './../../../models/user.model';
import { AuthResponse } from './../auth.service';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const REGISTER = 'REGISTER';
export const SET_TOKEN = 'SET_TOKEN';
export const SOCIAL_LOGIN = 'SOCIAL_LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const SOCIAL_LOGIN_SUCCESS = 'SOCIAL_LOGIN_SUCCESS';

export class Login implements Action {
  readonly type = LOGIN;

  constructor(public payload: User) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class Register implements Action {
  readonly type = REGISTER;

  constructor(public payload: FormData) {}
}

export class SetToken implements Action {
  readonly type = SET_TOKEN;

  constructor(public payload: string) {}
}

export class SocialLogin implements Action {
  readonly type = SOCIAL_LOGIN;
}

export class Authenticate implements Action {
  readonly type = AUTHENTICATE;

  constructor(public payload: string) {}
}

export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;

  constructor(public payload: AuthResponse) {}
}

export class LoginFailure implements Action {
  readonly type = LOGIN_FAILURE;
}

export class SocialLoginSuccess implements Action {
  readonly type = SOCIAL_LOGIN_SUCCESS;

  constructor(public payload: AuthResponse) {}
}

export type Action =
  | Login
  | Logout
  | Register
  | SetToken
  | SocialLogin
  | Authenticate
  | LoginSuccess
  | LoginFailure
  | SocialLoginSuccess;
