import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';

import * as fromRoot from '../store/app.reducer';

@Injectable()
export class FavoritesGuard implements CanActivate {

  constructor(private store: Store<fromRoot.AppState>, private router: Router) { }

  canActivate() {
    return this.store.select(fromRoot.selectAuthUserLoggedIn)
      .pipe(
        take(1),
        map(user => {
          if (user) {
            return true;
          }
          this.router.navigate(['/']);
          return false;
        })
      );
  }
}
