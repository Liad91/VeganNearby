import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  Renderer2
} from '@angular/core';
import { Router } from '@angular/router';
import { LatLngLiteral, MapsAPILoader } from '@agm/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import * as fromRoot from '../../store/app.reducers';
import * as searchActions from './store/search.actions';
import * as filtersActions from '../../places/filters/store/filters.actions';
import * as placeListActions from '../../places/place-list/store/place-list.actions';
import { State } from './store/search.reducers';
import { ToastService } from '../services/toast.service';
import { GeographicalService } from '../services/geographical.service';

@Component({
  selector: 'vn-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Input() public activatedRoute: 'home' | 'places';
  @ViewChild('search') private searchElementRef: ElementRef;
  public state: State;
  public location: string;
  public locateSpinner = false;
  public locateFailed = false;
  public stateSubscription: Subscription
  private coordinates: LatLngLiteral;
  private autocompleteListener: google.maps.MapsEventListener;

  constructor(private renderer: Renderer2,
              private router: Router,
              private store: Store<fromRoot.AppState>,
              private geoService: GeographicalService,
              private mapsApiLoader: MapsAPILoader,
              private toastService: ToastService) {}

  ngOnInit(): void {
    this.stateSubscription = this.store.select('search').subscribe(
      state => this.state = state
    );
    this.initializeAutocomplete();

    if (this.activatedRoute === 'places') {
      this.store.select(fromRoot.selectFiltersLocation)
        .take(1)
        .subscribe(location => this.location = location);
    }
  }

  private initializeAutocomplete(): void {
    this.mapsApiLoader.load()
      .then(() => {
        const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ['(cities)']
        });
        this.autocompleteListener = autocomplete.addListener('place_changed', () => {
          /** Handle not formatted address from autocomplete */
          if (!autocomplete.getPlace().formatted_address) {
            this.toastService.show('Sorry, but we didn\'t understand the location you entered');
            this.location = null;
            return;
          }
          this.autocompleSuccess(autocomplete.getPlace());
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
    this.coordinates = coordinates
    return this.geoService.geocoder(coordinates);
  }

  private geocoderSuccess(location: string): void {
    this.locateSpinner = false;
    this.location = location;
  }

  private geolocationFailure(): void {
    this.locateSpinner = false;
    this.locateFailed = true;
  }

  public onSearchChange(event: any): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      this.location = event.target.value;
    }
  }

  public onCategoryChange(event: any): void {
    this.store.dispatch(new searchActions.SetCategory(this.state.categories[+event.target.value]));
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
      this.state.loading = true;
      this.geoService.geocoder(this.location)
        .then(coordinates => {
          this.coordinates = coordinates;
          this.dispatchActions();
        })
        .catch(() => this.toastService.show('Something went wrong, please try again'));
    }
    else {
      this.dispatchActions();
    }
  }

  private dispatchActions(): void {
    const payload = {
      location: this.location,
      coordinates: this.coordinates,
      selectedCategory: this.state.selectedCategory
    }

    if (this.activatedRoute === 'home') {
      this.store.dispatch(new filtersActions.NewSearch(payload));
    }
    else {
      this.store.dispatch(new filtersActions.Search(payload));
    }
    this.coordinates = null;
    this.store.dispatch(new placeListActions.GetPlaces());
    this.router.navigate(['places', 'list']);
  }

  ngOnDestroy(): void {
    this.autocompleteListener.remove();
    this.stateSubscription.unsubscribe();
  }
}
