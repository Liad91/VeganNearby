import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from './store/app.reducers';
import * as authActions from './core/auth/store/auth.actions';

@Component({
  selector: 'vn-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public routerName: string;

  constructor(private store: Store<fromRoot.AppState>) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.store.select(fromRoot.selectRouter).subscribe(
      state => this.routerName = state ? state.state.root.children[0].data.name : 'root'
    );

    if (token) {
      this.store.dispatch(new authActions.Authenticate(token));
    }
  }
}
