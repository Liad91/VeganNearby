import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx'

import { ConnectionService } from '../../services/connection.service';
import { User } from '../../models/user.model';

@Injectable()
export class ProfileService {

  constructor(private http: Http, private connectionService: ConnectionService) {}

  public signUp(user: FormData): Observable<any> {
    return this.http.post(`${this.connectionService.serverUrl}/users/signup`, user)
      .timeout(this.connectionService.reqTimeout)
      .map(this.connectionService.extractData)
      .catch(this.connectionService.catchError);
  }

  public signIn(user: User): Observable<any> {
    return this.http.post(`${this.connectionService.serverUrl}/users/signin`, user)
      .timeout(this.connectionService.reqTimeout)
      .map(this.connectionService.extractData)
      .catch(this.connectionService.catchError);
  }

  public authJWT(token: string): Observable<any> {
    const headers = new Headers();

    headers.set('Authorization', token);
    return this.http.post(`${this.connectionService.serverUrl}/auth/jwt`, {}, { headers })
      .timeout(this.connectionService.reqTimeout)
      .map(this.connectionService.extractData)
      .catch(this.connectionService.catchError)
  }
}
