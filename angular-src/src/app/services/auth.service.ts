import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from '../models/user.model';
import { ProfileService } from '../components/profile/profile.service';
import { AuthSuccessResponse } from '../models/auth-response.model';

@Injectable()
export class AuthService {
  public currentUser = new BehaviorSubject<User | void>(null);
  public isAuthenticated = new Subject<boolean>();

  constructor(private profileService: ProfileService) {}

  public authenticate(): void {
    if (!this.hasToken()) {
      this.currentUser.next(null);
      return;
    }
    const token = this.getToken();

    this.profileService.authJWT(token)
      .subscribe(
        (response: AuthSuccessResponse) => this.login(response),
        err => this.logout()
      );
  }

  private hasToken(): boolean {
    const token = this.getToken();

    if (token) {
      return true;
    }
    this.isAuthenticated.next(false);
    return false;
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public login(response: AuthSuccessResponse): void {
    this.currentUser.next(response.user);
    localStorage.setItem('token', response.token);
    this.isAuthenticated.next(true);
  }

  public logout(): void {
    localStorage.clear();
    this.currentUser.next(null);
    this.isAuthenticated.next(false);
  }
}
