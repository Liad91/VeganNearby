import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  LatLngLiteral,
  LatLngBounds,
  MapsAPILoader,
  GoogleMapsAPIWrapper,
  AgmMap
} from '@agm/core';
import { Action, Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';

import * as fromPlaces from '../store/places.reducer';
import * as filtersActions from './store/filters.actions';
import { YelpBusiness } from '../../models/yelp.model';
import { Filter, State } from './store/filters.reducer';
import { GetPlaces } from '../place-list/store/place-list.actions';
import { ModalService } from './../../core/services/modal.service';
import { UtilitiesService } from '../../core/services/utilities.service';
import { GeographicalService } from '../../core/services/geographical.service';
import { CuisinesModalComponent } from './../../shared/components/cuisines-modal/cuisines-modal.component';

@Component({
  selector: 'vn-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {
  @ViewChild(AgmMap) map: any;
  @Input() sidenavMode = false;
  @Input() places: YelpBusiness[];
  public actions: Action[] = [];
  public state: State;
  public updateOnDrag = true;
  public mapBounds: LatLngBounds;
  private stateSubscription: Subscription;
  private dragEndSubscription: Subscription;

  public mapStyles = [
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        { lightness: 100 },
        { visibility: 'simplified' }
      ]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        { visibility: 'on' },
        { color: '#C6E2FF' }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'geometry.fill',
      stylers: [{ color: '#C5E3BF' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry.fill',
      stylers: [{ color: '#D1D1B8' }]
    }
  ];

  constructor(
    private store: Store<fromPlaces.FeatureState>,
    private mapsApiLoader: MapsAPILoader,
    private modalService: ModalService,
    private geoService: GeographicalService,
    private utilitiesService: UtilitiesService) {}

  ngOnInit(): void {
    this.stateSubscription = this.store.select(fromPlaces.selectFilters).subscribe(state => this.state = state);

    // TODO: Use (dragEnd) after https://github.com/SebastianM/angular-google-maps/pull/1159 will merged
    this.dragEndSubscription = (<GoogleMapsAPIWrapper>this.map._mapsWrapper)
      .subscribeToMapEvent('dragend')
      .subscribe(() => this.onDragEnd());
  }

  private onDragEnd(): void {
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

  public onMapCenterChange(event: LatLngLiteral): void {
    Object.assign(this.state.coordinates, event);
  }

  public onReset(): void {
    this.store.dispatch(new filtersActions.ResetFilters());
    this.dispatchActions();
  }

  public onApply(): void {
    if (this.actions.length) {
      this.actions.forEach(action => this.store.dispatch(action));
      this.dispatchActions();
      this.actions = [];
    }
  }

  public onCategoryChanged(category: Filter): void {
    this.store.dispatch(new filtersActions.SetCategory(category));
    this.dispatchActions();
  }

  public updatePrices(price: Filter): void {
    if (this.sidenavMode) {
      this.actions.push(new filtersActions.UpdatePrices(price));
    }
    else {
      this.store.dispatch(new filtersActions.UpdatePrices(price));
      this.dispatchActions();
    }
  }

  public updateCuisines(cuisine: Filter): void {
    if (this.sidenavMode) {
      this.actions.push(new filtersActions.UpdateCuisines(cuisine));
    }
    else {
      this.store.dispatch(new filtersActions.UpdateCuisines(cuisine));
      this.dispatchActions();
    }
  }

  private dispatchActions() {
    const queryParams = this.utilitiesService.navigationEnd.getValue().queryParams;

    if (Number(queryParams.p) === 1 &&
      Number(queryParams.lat) === this.state.coordinates.lat &&
      Number(queryParams.lng) === this.state.coordinates.lng) {
      this.store.dispatch(new GetPlaces());
      this.utilitiesService.screenSize
        .pipe(take(1))
        .subscribe(size => size === 'sm' || size === 'xs' ? window.scrollTo(0, 0) : null);
    }
    else {
      this.utilitiesService.navigate(['places', this.state.location], {
        queryParams: {
          p: 1,
          ...this.state.coordinates
        }
      });
    }
  }

  public openModal(): void {
    this.modalService.open(CuisinesModalComponent);
  }

  ngOnDestroy(): void {
    this.stateSubscription.unsubscribe();
    this.dragEndSubscription.unsubscribe();

    // Fix DOM nodes leak
    // https://github.com/SebastianM/angular-google-maps/issues/1207
    $(this.map._elem.nativeElement).remove();
  }
}
