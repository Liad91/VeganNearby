import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { AuthSuccessResponse, AuthFailedResponse } from '../../../models/auth-response.model';
import { QueryParams } from '../../../models/query-params.model';
import { ConnectionService } from '../../../services/connection.service';
import { ToastService } from '../../../services/toast.service';

@Injectable()
export class SocialProfileService {
  public response = new Subject<AuthSuccessResponse | AuthFailedResponse>();
  private isEventListener: boolean;
  public callback: Observable<any>;
  public callbackSubscription: Subscription;

  constructor(private toastService: ToastService, private connectionService: ConnectionService) {
    this.callback = Observable.fromEvent(window, 'socialCallback')
      .map((event: CustomEvent) => event.detail);
  }

  public login(network: string): void {
    this.createPopupWindow(network);
  }

  private createPopupWindow(network: string): void {
    const popup = this.openPopupWindow(network);
    const interval = setInterval(() => {
      if (popup.closed) {
        if (!this.callbackSubscription.closed) {
          return this.sendResponse({ failed: true });
        }
        clearInterval(interval);
      }
    }, 500);

    this.callback.subscribe(
      details => this.callbackHandler(details)
    );
  }

  private callbackHandler(data: any): void {
    if (data.err) {
      return this.sendResponse({ failed: true });
    }

    if (!data._id || !data.username || !data.email || !data.avatarUrl) {
      this.toastService.show('Connection failed');
      return this.sendResponse({ failed: true });
    }

    const response: AuthSuccessResponse = {
      user: {
        _id: data._id,
        username: data.username,
        email: data.email,
        avatarUrl: data.avatarUrl,
        favorites: data.favorites
      },
      token: data.token
    };
    this.sendResponse(response);
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
      const top = screenY + (( window.outerHeight - height) / 2);

      specs = `top=${top},left=${left},width=${width},height=${height}`;
    }
    return window.open(`${this.connectionService.serverUrl}/auth/${network}`, name, specs);
  }

  private sendResponse(response: AuthSuccessResponse | AuthFailedResponse ): void {
    this.response.next(response);
    this.isEventListener = false;
    this.callbackSubscription.unsubscribe();
  }
}
