import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from './../../../services/auth.service';

@Injectable()
export class CanActivateFavorites implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate() {
    if (!this.authService.currentUser.getValue()) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
