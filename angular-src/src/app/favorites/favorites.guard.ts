import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import * as fromRoot from '../store/app.reducer';

@Injectable()
export class FavoritesGuard implements CanActivate {

  constructor(private store: Store<fromRoot.AppState>, private router: Router) { }

  canActivate() {
    return this.store.select(fromRoot.selectAuthUserLoggedIn).map(user => {
      if (user) {
        return true;
      }
      this.router.navigate(['/']);
      return false;
    })
  }
}
