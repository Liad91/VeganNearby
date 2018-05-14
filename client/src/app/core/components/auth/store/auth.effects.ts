import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';

import { GetFavorites, ResetFavorites } from '../../../../favorites/store/favorites.actions';
import * as fromRoot from '../../../../store/app.reducer';
import { ModalService } from './../../../services/modal.service';
import { AuthResponse, AuthService } from './../auth.service';
import * as authActions from './auth.actions';

@Injectable()
export class AuthEffects {
  @Effect()
  register = this.actions.pipe(
    ofType(authActions.REGISTER),
    map((action: authActions.Register) => action.payload),
    exhaustMap(user => this.authService.register(user)
      .pipe(
        tap(response => this.onLoginSuccess(response)),
        map(response => new authActions.LoginSuccess(response)),
        catchError((error: HttpErrorResponse) => this.errorHandler(error))
      )
    )
  );

  @Effect()
  login = this.actions.pipe(
    ofType(authActions.LOGIN),
    map((action: authActions.Login) => action.payload),
    exhaustMap(user => this.authService.login(user)
      .pipe(
        tap((response => this.onLoginSuccess(response))),
        map(response => new authActions.LoginSuccess(response)),
        catchError((error: HttpErrorResponse) => this.errorHandler(error))
      )
    )
  );

  @Effect()
  update = this.actions.pipe(
    ofType(authActions.UPDATE),
    map((action: authActions.Update) => action.payload),
    exhaustMap(user => this.authService.update(user)
      .pipe(
        tap(response => this.onUpdateSuccess(response)),
        map(response => new authActions.UpdateSuccess(response)),
        catchError((error: HttpErrorResponse) => this.onUpdateFailure(error))
      )
    )
  );

  @Effect()
  authenticate = this.actions.pipe(
    ofType(authActions.AUTHENTICATE),
    map((action: authActions.Authenticate) => action.payload),
    exhaustMap(token => this.authService.authenticate(token)
      .pipe(
        tap(response => this.authService.storeToken(response.token)),
        map(response => new authActions.LoginSuccess(response)),
        catchError(error => of(new authActions.Logout()))
      )
    )
  );

  @Effect()
  setUserBackground = this.actions.pipe(
    ofType(authActions.SET_USER_BACKGROUND),
    map((action: authActions.SetUserBackground) => action.payload),
    exhaustMap(index => this.authService.setUserBackground(index)
      .pipe(
        map(response => new authActions.SetUserBackgroundSuccess(response)),
        catchError(error => of(new authActions.SetUserBackgroundFailure()))
      )
    )
  );

  @Effect({ dispatch: false })
  loginSuccess = this.actions.pipe(
    ofType(authActions.LOGIN_SUCCESS),
    map((action: authActions.LoginSuccess) => action.payload),
    tap((payload => this.getFavorites(payload.user.favorites)))
  );

  @Effect({ dispatch: false })
  socialLoginSuccess = this.actions.pipe(
    ofType(authActions.SOCIAL_LOGIN_SUCCESS),
    map((action: authActions.SocialLoginSuccess) => action.payload),
    tap(response => this.onLoginSuccess(response))
  );

  @Effect()
  logout = this.actions.pipe(
    ofType(authActions.LOGOUT),
    tap(response => this.authService.removeToken()),
    map(() => new ResetFavorites())
  );

  constructor(
    private store: Store<fromRoot.AppState>,
    private actions: Actions,
    private authService: AuthService,
    private modalService: ModalService) { }

  private onLoginSuccess(response: AuthResponse): void {
    this.authService.storeToken(response.token);
    this.modalService.close();
  }

  private onUpdateSuccess(response: AuthResponse): void {
    this.authService.storeToken(response.token);
    this.modalService.close();
  }

  private onUpdateFailure(error: HttpErrorResponse): Observable<authActions.UpdateFailure> {
    this.authService.error.next(error.error);
    return of(new authActions.UpdateFailure());
  }

  private errorHandler(error: HttpErrorResponse): Observable<authActions.ErrorOccurred> {
    this.authService.error.next(error.error);
    return of(new authActions.ErrorOccurred());
  }

  private getFavorites(favorites: string[]): void {
    if (favorites.length > 0) {
      this.store.dispatch(new GetFavorites());
    }
  }
}
