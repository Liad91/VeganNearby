import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx'

import { ConnectionService } from '../../services/connection.service';
import { User } from '../../models/user.model';

@Injectable()
export class ProfileService {

  constructor(private http: HttpClient, private connectionService: ConnectionService) {}

  public signUp(user: FormData): Observable<any> {
    return this.http.post(`${this.connectionService.serverUrl}/users/signup`, user)
      .timeout(this.connectionService.reqTimeout);
  }

  public signIn(user: User): Observable<any> {
    return this.http.post(`${this.connectionService.serverUrl}/users/signin`, user)
      .timeout(this.connectionService.reqTimeout);
  }

  public authJWT(token: string): Observable<any> {
    return this.http.post(`${this.connectionService.serverUrl}/auth/jwt`, {}, {
      headers: new HttpHeaders().set('Authorization', token)
    })
      .timeout(this.connectionService.reqTimeout);
  }
}
