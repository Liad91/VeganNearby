import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppState } from './../../../../store/app.reducer';
import { ConnectionService } from './../../../services/connection.service';
import { ToastService } from './../../../services/toast.service';
import { AuthResponse } from './../auth.service';
import * as authActions from './../store/auth.actions';

@Injectable()
export class AuthSocialService {
  public callback: Observable<any>;
  public callbackSubscription: Subscription;

  constructor(private store: Store<AppState>, private toastService: ToastService, private connectionService: ConnectionService) {
    this.callback = fromEvent(window, 'socialCallback')
      .pipe(
        map((event: CustomEvent) => event.detail)
      );
  }

  public login(network: string): void {
    this.createPopupWindow(network);
  }

  private createPopupWindow(network: string): void {
    const popup = this.openPopupWindow(network);
    const interval = setInterval(() => {
      if (popup.closed) {
        if (!this.callbackSubscription.closed) {
          return this.handleResponse(null);
        }
        clearInterval(interval);
      }
    }, 500);

    this.callbackSubscription = this.callback.subscribe(
      details => this.callbackHandler(details)
    );
  }

  private callbackHandler(data: any): void {
    if (data.err) {
      return this.handleResponse(null);
    }

    if (!data._id || !data.name || !data.email) {
      this.toastService.show('Connection failed');
      return this.handleResponse(null);
    }

    /** When favorites contain 1 item it returns a string */
    const favorites = [];

    if (data.favorites) {
      if (typeof data.favorites === 'string') {
        favorites.push(data.favorites);
      }
      else {
        favorites.push(...data.favorites);
      }
    }

    const response: AuthResponse = {
      user: {
        _id: data._id,
        name: data.name,
        email: data.email,
        avatarUrl: data.avatarUrl,
        background: +data.background,
        favorites
      },
      token: data.token
    };
    this.handleResponse(response);
  }

  private openPopupWindow(network: string): Window {
    let name = '';
    let specs = '';

    /** Open in new tab for small screens */
    if (window.innerWidth <= 1024 || window.innerHeight <= 800) {
      name = '_blank';
    }
    /** Open popup in the middle of the current screen */
    else {
      const height = 720;
      const width = 660;
      const left = screenX + ((window.outerWidth - width) / 2);
      const top = screenY + ((window.outerHeight - height) / 2);

      specs = `top=${top},left=${left},width=${width},height=${height}`;
    }
    return window.open(`${this.connectionService.serverUrl}/auth/${network}`, name, specs);
  }

  private handleResponse(response: AuthResponse | void): void {
    if (response) {
      this.store.dispatch(new authActions.SocialLoginSuccess(response));
    }
    else {
      this.store.dispatch(new authActions.ErrorOccurred());
    }
    this.callbackSubscription.unsubscribe();
  }
}
