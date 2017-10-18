import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/take';

import * as fromRoot from '../../store/app.reducers';
import * as authActions from '../../core/auth/store/auth.actions';
import * as favoritesActions from '../favorites/store/favorites.actions';
import { PlacesService } from '../places.service';
import { YelpBusiness } from './../../models/yelp.model';
import { ModalService } from '../../core/services/modal.service';
import { ToastService } from './../../core/services/toast.service';
import { AlertModalOptions } from '../../shared/components/index';
import { AuthModalComponent } from '../../core/auth/auth-modal/auth-modal.component';

@Component({
  selector: 'vn-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss']
})
export class PlaceComponent implements OnInit, OnDestroy {
  @Input() public place: YelpBusiness;
  private user: boolean;
  private userSubscription: Subscription;
  public favorite: boolean;
  public loading = false;

  constructor(
    private store: Store<fromRoot.AppState>,
    private modalService: ModalService,
    private placesService: PlacesService,
    private toastService: ToastService) {}

  ngOnInit() {
    this.userSubscription = this.store.select(fromRoot.selectAuthUserLoggedIn).subscribe(user => {
      this.user = user;
      if (user) {
        this.store.select(fromRoot.favoriteFactory(this.place.id)).take(1).subscribe(favorite => this.favorite = favorite);
      }
      else {
        this.favorite = false;
      }
    })
  }

  public manageFavorite(event: MouseEvent): void {
    event.stopPropagation();

    if (this.user) {
      this.loading = true;

      if (this.favorite) {
        this.placesService.removeFromFavorites(this.place.id).subscribe(
          () => this.removeFromFavoritesSuccess(),
          () => this.removeFromFavoritesFailure()
        );
      }
      else {
        this.placesService.addToFavorites(this.place.id).subscribe(
          () => this.addToFavoritesSuccess(),
          () => this.addToFavoritesFailure()
        );
      }
    }
    else {
      this.modalService.open(AuthModalComponent);
    }
  }

  private addToFavoritesSuccess(): void {
    this.loading = false;
    this.favorite = true;
    this.store.dispatch(new authActions.AddToUserFavorites(this.place.id));
    this.store.dispatch(new favoritesActions.AddToFavorites(this.place));
  }

  private addToFavoritesFailure(): void {
    this.loading = false;
    this.toastService.show('Add to favorites failed, Please try again.');
  }

  private removeFromFavoritesSuccess(): void {
    this.loading = false;
    this.favorite = false;
    this.store.dispatch(new authActions.RemoveFromUserFavorites(this.place.id));
    this.store.dispatch(new favoritesActions.RemoveFromFavorites(this.place.id));
  }

  private removeFromFavoritesFailure(): void {
    this.loading = false;
    this.toastService.show('remove from favorites failed, Please try again.');
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
