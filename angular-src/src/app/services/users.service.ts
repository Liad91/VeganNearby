import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx'

import { ConnectionService } from './connection.service';
import { User } from './../models/user.model';

@Injectable()
export class UsersService {

  constructor(private http: Http, private connectionService: ConnectionService) {}

  signUp(user: FormData) {
    return this.http.post(`${this.connectionService.serverUrl}/users/signup`, user)
      .timeout(this.connectionService.reqTimeout)
      .map(this.connectionService.extractData)
      .catch(this.connectionService.catchError);
  }

  signIn(user: User) {
    return this.http.post(`${this.connectionService.serverUrl}/users/signin`, user)
      .timeout(this.connectionService.reqTimeout)
      .map(this.connectionService.extractData)
      .catch(this.connectionService.catchError);
  }

  Auth(token: string) {
    const headers = new Headers();

    headers.set('Authorization', token);
    return this.http.post(`${this.connectionService.serverUrl}/users/authenticate`, {}, { headers })
      .timeout(this.connectionService.reqTimeout)
      .map(this.connectionService.extractData)
      .catch(this.connectionService.catchError)
  }
}
