import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { AuthSuccessResponse, AuthFailedResponse } from './../../../../models/auth-response';
import { QueryParams } from './../../../../models/query-params';
import { ConnectionService } from './../../../services/connection.service';
import { ToastService } from './../../../services/toast.service';

@Injectable()
export class SocialProfileService {
  public response = new Subject<AuthSuccessResponse | AuthFailedResponse>();
  private isEventListener: boolean;
  private callbackHandler: (event: CustomEvent) => void;

  constructor(private toastService: ToastService, private connectionService: ConnectionService) {}

  public login(network: string): void {
    this.createPopupWindow(network);
  }

  private createPopupWindow(network: string): void {
    const popup = this.openPopupWindow(network);
    const interval = setInterval(checkPopup.bind(this), 500);

    this.isEventListener = true;
    this.callbackHandler = callbackHandler.bind(this);

    window.addEventListener('socialCallback', this.callbackHandler, false);

    function checkPopup(): void {
      if (popup.closed) {
        if (this.isEventListener) {
          return this.sendResponse({ failed: true });
        }
        clearInterval(interval);
      }
    }

    function callbackHandler(event: CustomEvent): void {
      const data = event.detail;
      let response: AuthSuccessResponse;

      if (data.err) {
        return this.sendResponse({ failed: true });
      }

      if (!data._id || !data.username || !data.email || !data.avatarUrl) {
        this.showToast('Connection failed');
        return this.sendResponse({ failed: true });
      }

      response = {
        user: {
          _id: data._id,
          username: data.username,
          email: data.email,
          avatarUrl: data.avatarUrl
        },
        token: data.token
      };
      this.sendResponse(response);
    }
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

  private showToast(message: string): void {
    this.toastService.show(message);
  }

  private sendResponse(response: AuthSuccessResponse | AuthFailedResponse ): void {
    this.response.next(response);
    this.isEventListener = false;
    window.removeEventListener('socialCallback', this.callbackHandler, false);
  }
}
