import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { User } from './../models/user.model';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  public user: User;
  public isAuthenticated = new Subject<boolean>();

  constructor(private usersService: UsersService) {}

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private authFailed() {
    localStorage.clear();
    this.isAuthenticated.next(false);
  }

  private hasToken(): boolean {
    const token = this.getToken();

    if (token) {
      return true;
    }
    this.isAuthenticated.next(false);
    return false;
  }

  public authenticate() {
    if (this.hasToken) {
      const token = this.getToken();
      this.usersService.Auth(token)
      .subscribe(
        data => this.setUserData(data),
        err => this.authFailed()
      )
    }
  }

  public setUserData(data): void {
    localStorage.setItem('token', data.token);
    this.user = data.user;
    this.isAuthenticated.next(true);
  }
}