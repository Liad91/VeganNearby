import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { User } from './../models/user.model';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  public user = { username: '', email: '', id: '' };
  public isAuthenticated = new Subject<boolean>();

  constructor(private usersService: UsersService) {}

  private getToken(): string | null {
    return localStorage.getItem('token');
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
          data => this.login(data),
          err => this.logout()
        );
    }
  }

  public login(data): void {
    Object.assign(this.user, data.user);
    localStorage.setItem('token', data.token);
    this.isAuthenticated.next(true);
  }

  public logout() {
    const guest: User = {username: '', email: '', id: '1'};

    Object.assign(this.user, guest);
    localStorage.clear();
    this.isAuthenticated.next(false);
  }
}
