import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { AppState } from './store/app.reducer';
import * as authActions from './core/auth/store/auth.actions';
import { UtilitiesService } from './core/services/utilities.service';
import { routeStateTrigger } from './animations';

@Component({
  selector: 'vn-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeStateTrigger]
})
export class AppComponent implements OnInit {
  public routeName: Observable<string>;
  public mobileView: Observable<boolean>;

  constructor(private store: Store<AppState>, private utilitiesService: UtilitiesService) { }

  ngOnInit(): void {
    this.authenticate();

    this.routeName = this.utilitiesService.navigationEnd
      .pipe(
        map(snapshot => snapshot.data['name'] || 'root')
      );
  }

  private authenticate() {
    const token = localStorage.getItem('token');

    if (token) {
      this.store.dispatch(new authActions.Authenticate(token));
    }
  }
}
