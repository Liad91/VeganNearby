import { Injectable } from '@angular/core';

@Injectable()
export class ConnectionService {
  public serverUrl = 'http://127.0.0.1:3000';
  public reqTimeout = 5000;
}
