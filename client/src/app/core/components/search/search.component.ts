import { LatLngLiteral, MapsAPILoader } from '@agm/core';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import * as filtersActions from '../../../places/components/filters/store/filters.actions';
import * as placeListActions from '../../../places/components/place-list/store/place-list.actions';
import * as fromRoot from '../../../store/app.reducer';
import { GeographicalService } from '../../services/geographical.service';
import { ToastService } from '../../services/toast.service';
import { UtilitiesService } from '../../services/utilities.service';
import * as searchActions from './store/search.actions';
import { State } from './store/search.reducer';


@Component({
  selector: 'vn-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {
  @Input() public mode: 'home' | 'nav';
  @ViewChild('search') private searchElementRef: ElementRef;
  public state: State;
  public location: string;
  public focused = false;
  public locateSpinner = false;
  public locateFailed = false;
  public stateSubscription: Subscription;
  private coordinates: LatLngLiteral;
  private autocomplete: google.maps.places.Autocomplete;
  private autocompleteListener: google.maps.MapsEventListener;

  constructor(
    private renderer: Renderer2,
    private store: Store<fromRoot.AppState>,
    private geoService: GeographicalService,
    private utilitiesService: UtilitiesService,
    private mapsApiLoader: MapsAPILoader,
    private toastService: ToastService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.stateSubscription = this.store.select('search').subscribe(
      state => {
        if (this.state && state.loading !== this.state.loading) {
          this.changeDetectorRef.markForCheck();
        }
        this.state = state;
      }
    );

    if (this.mode === 'nav') {
      this.store.select(fromRoot.selectFiltersLocation).pipe(take(1)).subscribe(
        location => this.location = location
      );
    }
    this.initializeAutocomplete();
  }

  private initializeAutocomplete(): void {
    this.mapsApiLoader.load()
      .then(() => {
        this.autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ['(cities)']
        });
        this.autocompleteListener = this.autocomplete.addListener('place_changed', () => {
          /** Handle not formatted address from autocomplete */
          if (!this.autocomplete.getPlace().formatted_address) {
            return;
          }
          this.autocompleSuccess(this.autocomplete.getPlace());
        });
      })
      .catch(error => this.autocompleteFailure());
  }

  private autocompleSuccess(place: google.maps.places.PlaceResult): void {
    this.location = place.formatted_address;
    this.coordinates = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };
  }

  private autocompleteFailure(): void {
    this.toastService.show('Unable to complete your request');
  }

  public getLocation(): void {
    this.locateSpinner = true;
    this.geoService.geolocation()
      .then(coordinates => this.geolocationSuccess(coordinates))
      .then(location => this.geocoderSuccess(location))
      .catch(() => this.geolocationFailure());
  }

  private geolocationSuccess(coordinates: LatLngLiteral): Promise<string> {
    this.coordinates = coordinates;
    return this.geoService.geocoder(coordinates);
  }

  private geocoderSuccess(location: string): void {
    this.locateSpinner = false;
    this.location = location;
    this.changeDetectorRef.markForCheck();
  }

  private geolocationFailure(): void {
    this.locateSpinner = false;
    this.locateFailed = true;
    this.changeDetectorRef.markForCheck();
  }

  public onSearchChange(event: any): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      this.location = event.target.value;
    }
  }

  public onCategoryChange(event: any): void {
    this.store.dispatch(new searchActions.SetSearchCategory(Number(event)));
  }

  public preventDefault(event: any): void {
    event.stopPropagation();
  }

  public onSubmit(): void {
    if (this.state.loading) {
      return;
    }
    if (!this.location) {
      this.renderer.selectRootElement(this.searchElementRef.nativeElement).focus();
      return;
    }
    if (!this.coordinates) {
      if (this.mode === 'nav') {
        this.store.dispatch(new placeListActions.SetPacesLoading(true));
        this.store.dispatch(new searchActions.SetSearchLoading(true));
      }
      this.geoService.geocoder(this.location)
        .then(coordinates => {
          this.coordinates = coordinates;
          this.dispatchActions();
        })
        .catch(() => {
          this.store.dispatch(new placeListActions.SetPacesLoading(false));
          this.store.dispatch(new searchActions.SetSearchLoading(false));
          this.toastService.show('Something went wrong, please try again');
        });
    }
    else {
      this.dispatchActions();
    }
  }

  private dispatchActions(): void {
    const payload = {
      location: this.location,
      coordinates: this.coordinates,
      selectedCategory: this.state.categories[this.state.selectedCategoryIndex]
    };

    if (this.mode === 'home') {
      this.store.dispatch(new placeListActions.ResetPlaces());
      this.store.dispatch(new filtersActions.NewSearch(payload));
    }
    else {
      const { queryParams } = this.utilitiesService.navigationEnd.getValue();

      /** Prevent searching for similar coordinates in the place-list page */
      if (queryParams.lat && queryParams.lng) {
        if (Number(queryParams.p) === 1 &&
          Number(queryParams.lat) === this.coordinates.lat &&
          Number(queryParams.lng) === this.coordinates.lng) {
          this.store.dispatch(new placeListActions.SetPacesLoading(false));
          this.store.dispatch(new searchActions.SetSearchLoading(false));
          return;
        }
      }

      this.store.dispatch(new placeListActions.ResetPlaces());
      this.store.dispatch(new filtersActions.Search(payload));
    }

    this.utilitiesService.navigate(['places', this.location], {
      queryParams: {
        p: 1,
        ...this.coordinates
      }
    }, { scroll: true });
    this.coordinates = null;
  }

  ngOnDestroy(): void {
    if (this.autocompleteListener) {
      this.autocompleteListener.remove();
    }
    this.stateSubscription.unsubscribe();

    // Fix autocomplete DOM nodes leak
    $('.pac-container').remove();
  }
}
