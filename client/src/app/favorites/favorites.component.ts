import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { ToastService } from '../core/services/toast.service';
import { UtilitiesService } from '../core/services/utilities.service';
import { PlacesService } from '../places/places.service';
import { errorStateTrigger } from '../shared/animations';
import * as fromRoot from '../store/app.reducer';
import { placeStateTrigger } from './animations';
import { GetFavorites } from './store/favorites.actions';
import { State } from './store/favorites.reducer';

@Component({
  selector: 'vn-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  animations: [
    placeStateTrigger,
    errorStateTrigger
  ],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class FavoritesComponent implements OnInit, OnDestroy {
  public state: State;
  public errorLoading = false;
  public connectionError = false;
  public emptyPlaces: string[] = [];
  private userSubscription: Subscription;
  private stateSubscription: Subscription;

  constructor(
    private store: Store<fromRoot.AppState>,
    private placesService: PlacesService,
    private toastService: ToastService,
    private utilitiesService: UtilitiesService) { }

  ngOnInit(): void {
    this.userSubscription = this.store.select(fromRoot.selectAuthUserLoggedIn)
      .filter(user => !user)
      .subscribe(() => this.utilitiesService.navigate(['/'], {}, { scroll: true }));

    this.stateSubscription = this.store.select(fromRoot.selectFavorites).subscribe(state => {
      this.state = state;
      if (!state.loading && this.state.places.length > 0) {
        this.detectConnectionError();
      }
    });
  }

  /**
   * Every favorite request failure sends an empty place object.
   * If all of the received items are empty, an connection error will display.
  */
  private detectConnectionError(): void {
    this.state.places.forEach(place => !place.name ? this.emptyPlaces.push(place.id) : null);
    if (this.emptyPlaces.length === this.state.places.length) {
      this.connectionError = true;
    }
  }

  public onReload(): void {
    this.emptyPlaces = [];
    this.store.next(new GetFavorites());
  }

  public deleteEmptyPlaces(): void {
    this.errorLoading = true;
    this.placesService.removeManyFromFavorites(this.emptyPlaces)
      .subscribe(
        () => this.deleteEmptyPlacesSuccess(),
        () => this.deleteEmptyPlacesFailure()
      );
  }

  private deleteEmptyPlacesSuccess(): void {
    this.errorLoading = false;
    this.emptyPlaces = [];
    this.store.next(new GetFavorites());
  }

  private deleteEmptyPlacesFailure(): void {
    this.errorLoading = false;
    this.toastService.show(`Failed to remove the ${this.emptyPlaces.length > 1 ? 'items' : 'item'} from your favorites`);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.stateSubscription.unsubscribe();
  }
}
