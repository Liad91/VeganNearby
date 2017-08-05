import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as yelp from 'yelp-fusion';
import 'rxjs/Rx';

import { ConnectionService } from './connection.service';
import { YelpRequest, YelpResponse } from './../models/yelp.model';

@Injectable()
export class YelpService {

  constructor(private http: Http, private connectionService: ConnectionService) {}

  public search(location: string | number[], term: string): Observable<YelpResponse> {
    const data: YelpRequest = {
      term
    };

    if (typeof location === 'string') {
      data.location = location;
      return this.http.post(`${this.connectionService.serverUrl}/yelp/search`, data)
        .timeout(this.connectionService.reqTimeout)
        .map(this.connectionService.extractData)
        .catch(this.connectionService.catchError)
    }
  }
}
