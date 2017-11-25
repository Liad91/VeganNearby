import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { take } from 'rxjs/operators';

import * as fromRoot from '../../../store/app.reducer';
import * as authActions from '../../../core/auth/store/auth.actions';
import * as favoritesActions from '../../../favorites/store/favorites.actions';

import { PlacesService } from '../../../places/places.service';
import { ToastService } from '../../../core/services/toast.service';
import { ModalService } from '../../../core/services/modal.service';
import { YelpBusinessResponse } from '../../../models/yelp.model';
import { AlertModalOptions } from '../../../shared/components/index';
import { AuthModalComponent } from '../../../core/auth/auth-modal/auth-modal.component';
import { UtilitiesService } from '../../../core/services/utilities.service';

@Component({
  selector: 'vn-btn-favorite',
  templateUrl: './btn-favorite.component.html'
})
export class BtnFavoriteComponent implements OnInit, OnDestroy {
  @Input() placeId: string;
  @Input() placeName: string;
  private user: boolean;
  public loading = false;
  public favorite: boolean;
  private maxFavoritesLength = 20;
  private favoritesLength: number;
  private userSubscription: Subscription;
  private favoritesLengthSubscription: Subscription;

  constructor(
    private store: Store<fromRoot.AppState>,
    private utilitiesService: UtilitiesService,
    private placesService: PlacesService,
    private toastService: ToastService,
    private modalService: ModalService) {}

  ngOnInit(): void {
    this.userSubscription = this.store.select(fromRoot.selectAuthUserLoggedIn).subscribe(user => {
      this.user = user;
      if (user) {
        this.store.select(fromRoot.favoriteFactory(this.placeId))
          .pipe(
            take(1)
          )
          .subscribe(favorite => this.favorite = favorite);

        this.favoritesLengthSubscription = this.store.select(fromRoot.selectAuthUserFavoritesLength)
          .subscribe(length => this.favoritesLength = length);
      }
      else {
        this.favorite = false;
        if (this.favoritesLengthSubscription) {
          this.favoritesLengthSubscription.unsubscribe();
        }
      }
    });
  }

  public manageFavorite(event: MouseEvent): void {
    event.stopPropagation();

    if (this.user) {
      this.loading = true;

      if (this.favorite) {
        this.alertRemoveFromFavorites();
      }
      else {
        if (this.favoritesLength === this.maxFavoritesLength) {
          this.loading = false;
          this.alertMaxFavorites();
        }
        else {
          this.placesService.addToFavorites(this.placeId)
            .subscribe(
              place => this.addToFavoritesSuccess(place),
              () => this.addToFavoritesFailure()
            );
        }
      }
    }
    else {
      this.modalService.open(AuthModalComponent);
    }
  }

  private alertRemoveFromFavorites() {
    const options: AlertModalOptions = {
      title: 'Remove Favorite',
      message: `Are you sure you want to remove the item <strong>${this.placeName}</strong> from favorites?`,
      buttons: [
        {
          text: 'Cancel',
          handler: () => this.loading = false
        },
        {
          text: 'Confirm',
          handler: this.removeFromFavorites.bind(this)
        }
      ]
    };

    this.modalService.openAlert(options);
  }

  private alertMaxFavorites() {
    const options: AlertModalOptions = {
      title: 'Favorites Limit',
      message: 'You have reached your maximum favorites limit.',
      buttons: [
        {
          text: 'Dismiss'
        },
        {
          text: 'Manage Favorites',
          handler: () => this.utilitiesService.navigate(['favorites'], {}, { scroll: true })
        }
      ]
    };

    this.modalService.openAlert(options);
  }

  private removeFromFavorites() {
    this.placesService.removeFromFavorites(this.placeId)
      .subscribe(
        () => this.removeFromFavoritesSuccess(),
        () => this.removeFromFavoritesFailure()
      );
  }

  private addToFavoritesSuccess(place: YelpBusinessResponse): void {
    this.loading = false;
    this.favorite = true;
    this.store.dispatch(new authActions.AddToUserFavorites(this.placeId));
    this.store.dispatch(new favoritesActions.AddToFavorites(place));
  }

  private addToFavoritesFailure(): void {
    this.loading = false;
    this.toastService.show('Add to favorites failed, Please try again.');
  }

  private removeFromFavoritesSuccess(): void {
    this.loading = false;
    this.favorite = false;
    this.store.dispatch(new authActions.RemoveFromUserFavorites(this.placeId));
    this.store.dispatch(new favoritesActions.RemoveFromFavorites(this.placeId));
  }

  private removeFromFavoritesFailure(): void {
    this.loading = false;
    this.toastService.show('remove from favorites failed, Please try again.');
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    if (this.favoritesLengthSubscription) {
      this.favoritesLengthSubscription.unsubscribe();
    }
  }
}
