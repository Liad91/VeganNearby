import { Injectable } from '@angular/core';

import { environment } from './../../../environments/environment';

@Injectable()
export class ConnectionService {
  public serverUrl = environment.production ? 'http://127.0.0.1:3000' : 'http://127.0.0.1:3000';
  public reqTimeout = 10000;
}
