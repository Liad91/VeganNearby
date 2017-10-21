import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { placeStateTrigger } from './animations';
import { State } from './store/favorites.reducers';
import * as fromRoot from '../../store/app.reducers';
import { GetFavorites } from './store/favorites.actions';
import { YelpBusiness } from './../../models/yelp.model';
import { PlacesService } from '../places.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'vn-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  animations: [placeStateTrigger]
})

export class FavoritesComponent implements OnInit {
  public state: State;
  public errorLoading = false;
  public connectionError = false;
  public emptyPlaces: string[] = [];
  private stateSubscription: Subscription

  constructor(private store: Store<fromRoot.AppState>, private placesService: PlacesService, private toastService: ToastService) {}

  ngOnInit(): void {
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
}
