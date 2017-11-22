import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/exhaustMap';

import * as authActions from './auth.actions';
import * as fromRoot from '../../../store/app.reducer';
import { GetFavorites, ResetFavorites } from '../../../favorites/store/favorites.actions';
import { AuthService, AuthResponse } from './../auth.service';

@Injectable()
export class AuthEffects {
  @Effect()
  register = this.actions
    .ofType(authActions.REGISTER)
    .map((action: authActions.Register) => action.payload)
    .exhaustMap(user => this.authService.register(user)
      .do(response => this.onLoginSuccess(response))
      .map(response => new authActions.LoginSuccess(response))
      .catch((error: HttpErrorResponse) => this.onLoginFailure(error))
    );

  @Effect()
  login = this.actions
    .ofType(authActions.LOGIN)
    .map((action: authActions.Login) => action.payload)
    .exhaustMap(user => this.authService.login(user)
      .do(response => this.onLoginSuccess(response))
      .map(response => new authActions.LoginSuccess(response))
      .catch((error: HttpErrorResponse) => this.onLoginFailure(error))
    );

  @Effect()
  authenticate = this.actions
    .ofType(authActions.AUTHENTICATE)
    .map((action: authActions.Authenticate) => action.payload)
    .exhaustMap(token => this.authService.authenticate(token)
      .do(response => this.authService.storeToken(response.token))
      .map(response => new authActions.LoginSuccess(response))
      .catch(error => of(new authActions.Logout()))
    );

  @Effect()
  setUserBackground = this.actions
    .ofType(authActions.SET_USER_BACKGROUND)
    .map((action: authActions.SetUserBackground) => action.payload)
    .exhaustMap(index => this.authService.setUserBackground(index)
      .map(response => new authActions.SetUserBackgroundSuccess(response))
      .catch(error => of(new authActions.SetUserBackgroundFailure()))
    );

  @Effect({ dispatch: false })
  loginSuccess = this.actions
    .ofType(authActions.LOGIN_SUCCESS)
    .map((action: authActions.LoginSuccess) => action.payload)
    .do(payload => this.getFavorites(payload.user.favorites));

  @Effect({ dispatch: false })
  socialLoginSuccess = this.actions
    .ofType(authActions.SOCIAL_LOGIN_SUCCESS)
    .map((action: authActions.SocialLoginSuccess) => action.payload)
    .do(response => this.onLoginSuccess(response))
    .do(response => this.getFavorites(response.user.favorites));

  @Effect()
  logout = this.actions
    .ofType(authActions.LOGOUT)
    .do(response => this.authService.removeToken())
    .map(() => new ResetFavorites());

  constructor(private store: Store<fromRoot.AppState>, private actions: Actions, private authService: AuthService) {}

  private onLoginSuccess(response: AuthResponse): void {
    this.authService.storeToken(response.token);
    this.authService.closeModal.next();
  }

  private onLoginFailure(error: HttpErrorResponse): Observable<authActions.LoginFailure> {
    this.authService.loginFailure.next(JSON.parse(error.error));
    return of(new authActions.LoginFailure());
  }

  private getFavorites(favorites: string[]): void {
    if (favorites.length > 0) {
      this.store.dispatch(new GetFavorites());
    }
  }
}
