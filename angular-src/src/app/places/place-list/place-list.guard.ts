import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromPlaces from '../store/places.reducers';

@Injectable()
export class PlaceListGuard implements CanActivate {

  constructor(private store: Store<fromPlaces.FeatureState>, private router: Router) {}

  canActivate() {
    return this.store.select(fromPlaces.selectFiltersLocation)
      .take(1)
      .map(location => {
        if (location) {
          return true;
        }
        this.router.navigate(['/']);
        return false;
      });
  }
}
