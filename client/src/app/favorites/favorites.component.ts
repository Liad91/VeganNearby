import { RemoveFromUserFavorites } from './../core/components/auth/store/auth.actions';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, concat } from 'rxjs';

import { UtilitiesService } from '../core/services/utilities.service';
import { PlacesService } from '../places/places.service';
import { errorStateTrigger } from '../shared/animations';
import * as fromRoot from '../store/app.reducer';
import { placeStateTrigger } from './animations';
import { GetFavorites, ReloadEmptyFavorites, RemoveFromFavorites, SetLoading, RemoveFromEmptyFavorites } from './store/favorites.actions';
import { State } from './store/favorites.reducer';

@Component({
  selector: 'vn-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  animations: [
    placeStateTrigger,
    errorStateTrigger
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FavoritesComponent implements OnInit, OnDestroy {
  public state: State;
  private userSubscription: Subscription;
  private stateSubscription: Subscription;

  constructor(
    private store: Store<fromRoot.AppState>,
    private placesService: PlacesService,
    private utilitiesService: UtilitiesService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.store.select(fromRoot.selectAuthUserLoggedIn)
      .filter(user => !user)
      .subscribe(() => {
        this.utilitiesService.navigate(['/'], {}, { scroll: true });
      });

    this.stateSubscription = this.store.select(fromRoot.selectFavorites).subscribe(state => {
      this.state = state;

      this.changeDetectorRef.markForCheck();
    });
  }

  onReloadEmptyPlaces() {
    this.store.dispatch(new ReloadEmptyFavorites(this.state.emptyFavorites.map(favorite => favorite.id)));
  }

  public onReload(): void {
    this.store.dispatch(new GetFavorites());
  }

  public deleteEmptyPlaces(): void {
    const requests = this.state.emptyFavorites.map(favorite => this.placesService.removeFromFavorites(favorite.id));

    this.store.dispatch(new SetLoading('emptyFavorites'));
    this.changeDetectorRef.markForCheck();

    concat(...requests).subscribe(
      ({ id }) => {
        this.store.dispatch(new RemoveFromUserFavorites(id));
        this.store.dispatch(new RemoveFromEmptyFavorites(id));
      },
      () => { },
      () => {
        this.store.dispatch(new SetLoading(null));
        this.changeDetectorRef.markForCheck();
      }
    );
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.stateSubscription.unsubscribe();
  }
}
