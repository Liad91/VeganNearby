import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { routeStateTrigger } from './animations';
import { AppState } from './store/app.reducers';
import { Authenticate } from './core/auth/store/auth.actions';

@Component({
  selector: 'vn-root',
  templateUrl: './app.component.html',
  animations: [ routeStateTrigger ]
})
export class AppComponent implements OnInit {

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.store.dispatch(new Authenticate(token));
    }
  }

  public getAnimationState(outlet: RouterOutlet): string {
    return outlet.activatedRouteData['state'] || 'root';
  }
}
