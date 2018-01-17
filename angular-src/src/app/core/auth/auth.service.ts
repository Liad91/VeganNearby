import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { timeout, mapTo } from 'rxjs/operators';

import { ConnectionService } from './../services/connection.service';
import { User } from './../../models/user.model';


export interface AuthResponse {
  user: User;
  token: string;
}

@Injectable()
export class AuthService {
  public loginFailure = new Subject<any>();

  constructor(private http: HttpClient, private connectionService: ConnectionService) {}

  public register(user: FormData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.connectionService.serverUrl}/users/register`, user)
      .pipe(
        timeout(this.connectionService.reqTimeout)
      );
  }

  public login(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.connectionService.serverUrl}/users/login`, user)
      .pipe(
        timeout(this.connectionService.reqTimeout)
      );
  }

  public setUserBackground(index: number): Observable<number> {
    return this.http.put(`${this.connectionService.serverUrl}/users/background`, { index }, {
      headers: new HttpHeaders().set('Authorization', localStorage.getItem('token'))
    })
      .pipe(
        timeout(this.connectionService.reqTimeout),
        mapTo(index)
      );
  }

  public authenticate(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.connectionService.serverUrl}/auth/jwt`, {}, {
      headers: new HttpHeaders().set('Authorization', token)
    })
      .pipe(
        timeout(this.connectionService.reqTimeout)
      );
  }

  public storeToken(token: string) {
    localStorage.setItem('token', token);
  }

  public removeToken() {
    localStorage.clear();
  }
}
