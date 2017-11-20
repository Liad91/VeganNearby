import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';

import {AppState} from './store/app.reducer';
import * as authActions from './core/auth/store/auth.actions';
import { UtilitiesService } from './core/services/utilities.service';
import { mobileRouteStateTrigger } from './animations';

@Component({
  selector: 'vn-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ mobileRouteStateTrigger ]
})
export class AppComponent implements OnInit {
  public routeName: Observable<string>;
  public mobileView: Observable<boolean>;

  constructor(private store: Store<AppState>, private utilitiesService: UtilitiesService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.store.dispatch(new authActions.Authenticate(token));
    }
    this.routeName = this.utilitiesService.navigationEnd.map(snapshot => snapshot.data['name'] || 'root');
    this.mobileView = this.utilitiesService.screenSize.map(size => size === 'sm' || size === 'xs');
  }
}
