import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {
  LatLngLiteral,
  LatLngBounds,
  MapsAPILoader,
  GoogleMapsAPIWrapper,
  AgmMap
} from '@agm/core';
import { Store } from '@ngrx/store';
import { MzModalService } from 'ng2-materialize';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import * as fromPlaces from '../store/places.reducers';
import * as filtersActions from './store/filters.actions';
import * as placeListActions from '../place-list/store/place-list.actions';
import { YelpBusiness } from '../../models/yelp.model';
import { Filter, State } from './store/filters.reducers';
import { GeographicalService } from '../../core/services/geographical.service';
import { CuisinesModalComponent } from './cuisines-modal/cuisines-modal.component';

@Component({
  selector: 'vn-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {
  @ViewChild(AgmMap) map: any;
  public state: State;
  public places: Observable<YelpBusiness[]>;
  public filtersApplied: Observable<boolean>;
  public mapBounds: LatLngBounds;
  public updateOnDrag = true;
  private stateSubscription: Subscription;
  private dragEndSubscription: Subscription;

  constructor(
    private store: Store<fromPlaces.FeatureState>,
    private geoService: GeographicalService,
    private mapsApiLoader: MapsAPILoader,
    private modalService: MzModalService) {}

  ngOnInit(): void {
    this.places = this.store.select(fromPlaces.selectPlaceListPlaces);
    this.filtersApplied = this.store.select(fromPlaces.selectFiltersApplied);
    this.stateSubscription = this.store.select(fromPlaces.selectFilters).subscribe(state => this.state = state);

    // TODO: Use (dragEnd) after https://github.com/SebastianM/angular-google-maps/pull/1159 will merged
    this.dragEndSubscription = (this.map._mapsWrapper as GoogleMapsAPIWrapper)
      .subscribeToMapEvent('dragend')
      .subscribe(() => this.onDragEnd());
  }

  public onResetFilters(): void {
    this.store.dispatch(new filtersActions.ResetFilters());
  }

  public onMapCenterChange(event: LatLngLiteral): void {
    Object.assign(this.state.coordinates, event);
  }

  public onDragEnd(): void {
    if (this.updateOnDrag) {
      this.geoService.geocoder(this.state.coordinates)
      .then(location => this.geocoderSuccess(location))
      .then(radius => this.getRadiusSuccess(radius))
      .catch(() => this.dispatchActions());
    }
  }

  private geocoderSuccess(location: string): Promise<number> {
    this.store.dispatch(new filtersActions.SetLocation(location));
    return this.getRadius();
  }

  private getRadius(): Promise<number> {
    const from = new google.maps.LatLng(this.state.coordinates.lat, this.state.coordinates.lng);
    const to = new google.maps.LatLng(this.mapBounds.getNorthEast().lat(), this.mapBounds.getNorthEast().lng());

    return new Promise((resolve, reject) => {
      this.mapsApiLoader.load()
        .then(() => {
          resolve(Math.floor(google.maps.geometry.spherical.computeDistanceBetween(from, to) / 2.2));
        });
    });
  }

  private getRadiusSuccess(radius: number): void {
    this.store.dispatch(new filtersActions.SetRadius(radius));
    this.dispatchActions();
  }

  public onCategoryChanged(category: Filter): void {
    this.store.dispatch(new filtersActions.SetCategory(category));
    this.dispatchActions();
  }

  public updatePrices(price: Filter): void {
    this.store.dispatch(new filtersActions.UpdatePrices(price));
    this.dispatchActions();
  }

  public updateCuisines(cuisine: Filter): void {
    this.store.dispatch(new filtersActions.UpdateCuisines(cuisine));
    this.dispatchActions();
  }

  private dispatchActions(): void {
    this.store.dispatch(new filtersActions.SetOffset(null));
    this.store.dispatch(new placeListActions.GetPlaces());
    this.store.dispatch(new placeListActions.SetCurrentPage(1));
  }

  public openModal(): void {
    this.modalService.open(CuisinesModalComponent);
  }

  ngOnDestroy(): void {
    this.stateSubscription.unsubscribe();
    this.dragEndSubscription.unsubscribe();
  }
}
