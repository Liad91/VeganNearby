import { Component, OnInit, Input } from '@angular/core';
import { MzModalService } from 'ng2-materialize';

import { User } from './../../../../models/user.model';
import { YelpBusiness } from '../../../../models/yelp.model';
import { ProfileComponent } from './../../../../components/profile/profile.component';
import { PlacesService } from './../../places.service';
import { AuthService } from './../../../../services/auth.service';
import { ToastService } from './../../../../services/toast.service';

@Component({
  selector: 'vn-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss']
})
export class PlaceComponent implements OnInit {
  @Input() public place: YelpBusiness;
  private currentUser: User | void;
  public isFavorite: boolean;
  public loading = false;

  constructor(
    private modalService: MzModalService,
    private placesService: PlacesService,
    private authService: AuthService,
    private toastService: ToastService) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(
      user => this.initialFavorites(user)
    );
  }

  private initialFavorites(user: User | void) {
    this.currentUser = user;

    if (!this.currentUser) {
      this.isFavorite = false;
    }
    else {
      if (this.currentUser.favorites) {
        this.isFavorite = this.currentUser.favorites.indexOf(this.place.id) > -1 ? true : false;
      }
      else {
        this.isFavorite = false;
      }
    }
  }

  public toggleFavorite(event: MouseEvent): void {
    event.stopPropagation();

    if (!this.currentUser) {
      this.modalService.open(ProfileComponent);
    }
    else {
      this.loading = true;

      if (this.isFavorite) {
        this.placesService.removeFromFavorites(this.place.id).subscribe(
          () => this.removeFromFavoritesSuccess(),
          () => this.removeFromFavoritesError()
        );
      }
      else {
        this.placesService.addToFavorites(this.place.id).subscribe(
          () => this.addToFavoritesSuccess(),
          () => this.addToFavoritesError()
        );
      }
    }
  }

  private addToFavoritesSuccess(): void {
    this.loading = false;

    if (this.currentUser) {
      this.currentUser.favorites.push(this.place.id);
      this.isFavorite = true;
    }
  }

  private addToFavoritesError(): void {
    this.loading = false;
    this.toastService.show('Add to favorites failed, Please try again.');
  }

  private removeFromFavoritesSuccess(): void {
    this.loading = false;

    if (this.currentUser) {
      const index = this.currentUser.favorites.findIndex(i => i === this.place.id);

      this.currentUser.favorites.splice(index, 1);
      this.isFavorite = false;
    }
  }

  private removeFromFavoritesError(): void {
    this.loading = false;
    this.toastService.show('remove from favorites failed, Please try again.');
  }
}
