import { Component, OnInit } from '@angular/core';

import { YelpBusiness } from './../../models/yelp.model';
import { AuthService } from './../../core/auth/auth.service';
import { PlacesService } from './../places.service';

@Component({
  selector: 'vn-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})

export class FavoritesComponent implements OnInit {
  public places: YelpBusiness[] = [];
  public loading = false;

  constructor(private authService: AuthService, private placesService: PlacesService) {}

  ngOnInit(): void {
    // const user = this.authService.currentUser.getValue();

    // if (user) {
    //   if (user.favorites.length > 0) {
    //     this.loading = true;

    //     this.placesService.getFavorites().subscribe(
    //       places => this.getFavoritesSuccess(places)
    //     );
    //   }
    // }
  }

  private getFavoritesSuccess(places: YelpBusiness[]): void {
    this.loading = false;
    this.places.push(...places);
  }
}
