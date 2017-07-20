import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx'

import { ConnectionService } from './connection.service';
import { User } from './../models/user.model';

@Injectable()
export class UsersService {

  constructor(private http: Http, private connectionService: ConnectionService) {}

  signUp(user: User) {
    return this.http.post(`${this.connectionService.serverUrl}/users/register`, user)
      .timeout(this.connectionService.reqTimeout)
      .map(this.connectionService.extractData)
      .catch(this.connectionService.catchError);
  }

  signIn(user: User) {
    return this.http.post(`${this.connectionService.serverUrl}/users/authenticate`, user)
      .timeout(this.connectionService.reqTimeout)
      .map(this.connectionService.extractData)
      .catch(this.connectionService.catchError);
  }
}