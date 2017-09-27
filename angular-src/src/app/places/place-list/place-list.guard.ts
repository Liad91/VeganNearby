import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { PlacesService } from './../places.service';

@Injectable()
export class PlaceListGuard implements CanActivate {

  constructor(private router: Router, private placesService: PlacesService) { }

  canActivate() {
    if (!this.placesService.data.businesses) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
