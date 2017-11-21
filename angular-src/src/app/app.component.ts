import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/withLatestFrom';
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
  public routeAnimationState: Observable<string>;

  public mobileView: Observable<boolean>;

  constructor(private store: Store<AppState>, private utilitiesService: UtilitiesService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.store.dispatch(new authActions.Authenticate(token));
    }
    this.routeName = this.utilitiesService.navigationEnd.map(snapshot => snapshot.data['name'] || 'root');

    this.routeAnimationState = this.utilitiesService.navigationEnd
      .withLatestFrom(this.utilitiesService.screenSize)
      .map(([snapshot, size]) => {
        if (size === 'sm' || size === 'xs') {
          if (this.utilitiesService.navigationData.getValue()['noMobileAnimation']) {
            return `nma-${snapshot.data['name'] || 'root'}`;
          }
          return `m-${snapshot.data['name'] || 'root'}`;
        }
        return `${snapshot.data['name'] || 'root'}`;
      });
  }
}
