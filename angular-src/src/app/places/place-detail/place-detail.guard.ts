import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';

import * as fromPlaces from '../store/places.reducer';
import { GetPlace } from './store/place-detail.actions';

@Injectable()
export class PlaceDetailGuard implements CanActivate {

  constructor(private store: Store<fromPlaces.FeatureState>, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): boolean {
    this.store.select(fromPlaces.selectPlaceDetail).take(1).subscribe(state => {
      if (!state.place && !state.loading) {
        this.store.dispatch(new GetPlace(route.params.id));
      }
    });
    return true;
  }
}
