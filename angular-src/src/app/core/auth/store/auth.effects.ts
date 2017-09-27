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

import * as AuthActions from './auth.actions';
import { AuthService, AuthResponse } from './../auth.service';

@Injectable()
export class AuthEffects {
  @Effect()
  authRegister = this.actions
    .ofType(AuthActions.REGISTER)
    .map((action: AuthActions.Register) => action.payload)
    .exhaustMap(user => this.authService.register(user)
      .do(response => this.loginSuccess(response))
      .map(response => new AuthActions.LoginSuccess(response))
      .catch((error: HttpErrorResponse) => this.loginFailure(error))
    );

  @Effect()
  authLogin = this.actions
    .ofType(AuthActions.LOGIN)
    .map((action: AuthActions.Login) => action.payload)
    .exhaustMap(user => this.authService.login(user)
      .do(response => this.loginSuccess(response))
      .map(response =>  new AuthActions.LoginSuccess(response))
      .catch((error: HttpErrorResponse) => this.loginFailure(error))
    );

  @Effect()
  authAuthenticate = this.actions
    .ofType(AuthActions.AUTHENTICATE)
    .map((action: AuthActions.Authenticate) => action.payload)
    .exhaustMap(token => this.authService.authenticate(token)
      .do(response => this.authService.storeToken(response.token))
      .map(response =>  new AuthActions.LoginSuccess(response))
      .catch(error => of(new AuthActions.Logout()))
    );

  @Effect({ dispatch: false })
  authSocialLoginSuccess = this.actions
    .ofType(AuthActions.SOCIAL_LOGIN_SUCCESS)
    .map((action: AuthActions.SocialLoginSuccess) => action.payload)
    .do(response => this.loginSuccess(response));

  @Effect({ dispatch: false })
  authLogout = this.actions
    .ofType(AuthActions.LOGOUT)
    .do(response => this.authService.removeToken());

  constructor(private actions: Actions, private authService: AuthService) {}

  private loginSuccess(response: AuthResponse): void {
    this.authService.storeToken(response.token);
    this.authService.closeModal.next();
  }

  private loginFailure(error: HttpErrorResponse): Observable<AuthActions.LoginFailure> {
    this.authService.loginFailure.next(JSON.parse(error.error));
    return of(new AuthActions.LoginFailure());
  }
}
