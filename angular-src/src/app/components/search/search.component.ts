import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  Renderer2
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';

import { YelpFilter, YelpSearchParams, YelpSearchResponse } from './../../models/yelp.model';
import { FiltersService } from '../../pages/places/places-list/filters/filters.service';
import { PlacesService } from '../../pages/places/places.service';
import { ToastService } from '../../services/toast.service';

class Location {
  string: string;
  geometry: {
    lat: number,
    lng: number
  };
}

@Component({
  selector: 'vn-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Input() public mode: 'home' | 'nav';
  @ViewChild('search') private searchElementRef: ElementRef;
  public location = new Location;
  public locateSpinner = false;
  public locateFailed = false;
  public searching = false;
  public categories: YelpFilter[];
  public selectedCategory: YelpFilter;
  public selectedCategoryIndex: number;
  private autocompleteListener: google.maps.MapsEventListener;

  constructor(private renderer: Renderer2,
              private router: Router,
              private filtersService: FiltersService,
              private placesService: PlacesService,
              private mapsApiLoader: MapsAPILoader,
              private toastService: ToastService) {}

  ngOnInit(): void {
    this.categories = this.placesService.categories;
    this.selectedCategory = this.placesService.selectedCategory;
    this.selectedCategoryIndex = this.categories.findIndex(category => category.alias === this.selectedCategory.alias);
    this.buildLocationAutocomplete();

    if (this.mode === 'nav' && this.placesService.selectedLocation) {
      this.location.string = this.placesService.selectedLocation.getValue();
    }
  }

  private buildLocationAutocomplete(): void {
    this.mapsApiLoader.load()
      .then(() => {
        const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ['(cities)']
        });
        this.autocompleteListener = autocomplete.addListener('place_changed', () => {
          /** Handle not formatted address from autocomplete */
          if (!autocomplete.getPlace().formatted_address) {
            this.toastService.show('Sorry, but we didn\'t understand the location you entered');
            this.location.string = '';
            return;
          }
          this.autocompleSuccess(autocomplete.getPlace())
        });
      })
      .catch(error => this.autocompleteError());
  }

  private autocompleSuccess(place: google.maps.places.PlaceResult) {
    this.location.string = place.formatted_address;
    this.location.geometry = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };
  }

  private autocompleteError() {
    this.toastService.show('Unable to complete your request');
  }

  private geoSuccess(position: Position): void {
    this.location.geometry = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    this.placesService.geocoder(position.coords.latitude, position.coords.longitude)
      .then((location: string) => {
        this.locateSpinner = false;
        this.location.string = location;
      })
      .catch(this.geoError.bind(this));
  }

  private geoError(): void {
    this.toastService.show('Unable to retrieve your location');
    this.locateSpinner = false;
    this.locateFailed = true;
  }

  public getLocation(): void {
    if (!navigator.geolocation) {
      this.toastService.show('Geolocation is not supported by your browser');
      this.locateFailed = true;
      return;
    }
    const options = {
      enableHighAccuracy: true,
      timeout: 15000
    };

    this.locateSpinner = true;
    navigator.geolocation.getCurrentPosition(
      position => this.geoSuccess(position),
      error => this.geoError(),
      options
    );
  }

  public onSearchChange(event: any) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      this.location.string = event.target.value;
    }
  }

  public onCategoryChange(): void {
    if (this.selectedCategory.alias !== this.categories[this.selectedCategoryIndex].alias) {
      Object.assign(this.selectedCategory, this.categories[this.selectedCategoryIndex]);
    }
  }

  public onSubmit(): void {
    if (this.searching) {
      return;
    }
    if (!this.location.string) {
      this.renderer.selectRootElement(this.searchElementRef.nativeElement).focus();
      return;
    }

    this.searching = true;
    let params: YelpSearchParams;

    /** Use default params */
    if (this.mode === 'home') {
      params = {
        location: this.location.string,
        categories: this.selectedCategory.alias,
        radius: 1489
      };

      this.filtersService.reset();
    }
    /** Use previous params */
    else {
      params = this.filtersService.searchState.getValue();
      params.location = this.location.string;
      params.latitude = null;
      params.longitude = null;
    }

    this.filtersService.searchState.next(params);
    this.placesService.search(params)
      .subscribe(
        response => this.searchSuccess(response),
        err => this.searchError()
      );
  }

  private searchError() {
    this.searching = false;
    this.toastService.show('Connection error, please try again');
  }

  private searchSuccess(response: YelpSearchResponse) {
    /** Handle Yelp not found location */
    if (response.error) {
      response.region.center.latitude = this.location.geometry.lat;
      response.region.center.longitude = this.location.geometry.lng;
    }
    if (this.mode === 'nav') {
      this.filtersService.updateMap.next();
    }
    this.searching = false;
    this.router.navigateByUrl('/places');
  }

  ngOnDestroy() {
    this.autocompleteListener.remove();
  }
}
