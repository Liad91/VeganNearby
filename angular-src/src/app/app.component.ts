import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import {AppState} from './store/app.reducers';
import * as authActions from './core/auth/store/auth.actions';
import { UtilitiesService } from './core/services/utilities.service';

@Component({
  selector: 'vn-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public routerName: string;

  constructor(private store: Store<AppState>, private utilitiesService: UtilitiesService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    this.utilitiesService.navigationEnd.subscribe(
      snapshot => this.routerName = snapshot.data['name'] || 'root'
    );

    if (token) {
      this.store.dispatch(new authActions.Authenticate(token));
    }
  }
}
