import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class ConnectionService {
  public serverUrl = 'http://127.0.0.1:3000';
  public reqTimeout = 5000;

  public extractData(data: Response): any {
    return data.json();
  }

  public catchError(err: Response | any): ErrorObservable {
    err.title = 'An error occurred';
    err.message = err.message || 'Please try again later';
    return err.json ? Observable.throw(err.json()) : Observable.throw(err);
  }
}
