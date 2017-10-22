import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/timeout';

import { ConnectionService } from './../services/connection.service';
import { User } from './../../models/user.model';


export interface AuthResponse {
  user: User,
  token: string
}

@Injectable()
export class AuthService {
  public closeModal = new Subject<any>();
  public loginFailure = new Subject<any>();

  constructor(private http: HttpClient, private connectionService: ConnectionService) {}

  public register(user: FormData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.connectionService.serverUrl}/users/register`, user)
      .timeout(this.connectionService.reqTimeout);
  }

  public login(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.connectionService.serverUrl}/users/login`, user)
      .timeout(this.connectionService.reqTimeout);
  }

  public setUserBackground(index: number): Observable<{ index: number }> {
    return this.http.put<{ index: number }>(`${this.connectionService.serverUrl}/users/background`, { index }, {
      headers: new HttpHeaders().set('Authorization', localStorage.getItem('token'))
    }).timeout(this.connectionService.reqTimeout);
  }

  public authenticate(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.connectionService.serverUrl}/auth/jwt`, {}, {
      headers: new HttpHeaders().set('Authorization', token)
    }).timeout(this.connectionService.reqTimeout);
  }

  public storeToken(token: string) {
    localStorage.setItem('token', token);
  }

  public removeToken() {
    localStorage.clear();
  }
}
