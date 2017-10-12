import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/exhaustMap';

import * as authActions from './auth.actions';
import { AuthService, AuthResponse } from './../auth.service';

@Injectable()
export class AuthEffects {
  @Effect()
  authRegister = this.actions
    .ofType(authActions.REGISTER)
    .map((action: authActions.Register) => action.payload)
    .exhaustMap(user => this.authService.register(user)
      .do(response => this.loginSuccess(response))
      .map(response => new authActions.LoginSuccess(response))
      .catch((error: HttpErrorResponse) => this.loginFailure(error))
    );

  @Effect()
  authLogin = this.actions
    .ofType(authActions.LOGIN)
    .map((action: authActions.Login) => action.payload)
    .exhaustMap(user => this.authService.login(user)
      .do(response => this.loginSuccess(response))
      .map(response => new authActions.LoginSuccess(response))
      .catch((error: HttpErrorResponse) => this.loginFailure(error))
    );

  @Effect()
  authAuthenticate = this.actions
    .ofType(authActions.AUTHENTICATE)
    .map((action: authActions.Authenticate) => action.payload)
    .exhaustMap(token => this.authService.authenticate(token)
      .do(response => this.authService.storeToken(response.token))
      .map(response => new authActions.LoginSuccess(response))
      .catch(error => of(new authActions.Logout()))
    );

  @Effect({ dispatch: false })
  authSocialLoginSuccess = this.actions
    .ofType(authActions.SOCIAL_LOGIN_SUCCESS)
    .map((action: authActions.SocialLoginSuccess) => action.payload)
    .do(response => this.loginSuccess(response));

  @Effect({ dispatch: false })
  authLogout = this.actions
    .ofType(authActions.LOGOUT)
    .do(response => this.authService.removeToken());

  constructor(private actions: Actions, private authService: AuthService) {}

  private loginSuccess(response: AuthResponse): void {
    this.authService.storeToken(response.token);
    this.authService.closeModal.next();
  }

  private loginFailure(error: HttpErrorResponse): Observable<authActions.LoginFailure> {
    this.authService.loginFailure.next(JSON.parse(error.error));
    return of(new authActions.LoginFailure());
  }
}
