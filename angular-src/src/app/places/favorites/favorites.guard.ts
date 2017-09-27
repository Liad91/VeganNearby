import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class FavoritesGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate() {
    // if (!this.authService.currentUser.getValue()) {
    //   this.router.navigate(['/']);
    //   return false;
    // }
    return true;
  }
}
