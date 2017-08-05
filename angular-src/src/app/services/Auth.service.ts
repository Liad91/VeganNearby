import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { User } from './../models/user.model';
import { UsersService } from './users.service';
import { AuthSuccessResponse } from './../models/auth-response';

@Injectable()
export class AuthService {
  public user: User = { email: '', username: '', _id: '', avatarUrl: '' };
  public isAuthenticated = new Subject<boolean>();

  constructor(private usersService: UsersService) {}

  public authenticate(): void {
    if (!this.hasToken()) {
      this.user._id = '1';
      return;
    }
    const token = this.getToken();

    this.usersService.authJWT(token)
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

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  public login(response: AuthSuccessResponse): void {
    Object.assign(this.user, response.user);
    localStorage.setItem('token', response.token);
    this.isAuthenticated.next(true);
  }

  public logout(): void {
    localStorage.clear();
    this.user.avatarUrl = '';
    this.user.email = '';
    this.user.username = '';
    this.user._id = '1';
    this.isAuthenticated.next(false);
  }
}
