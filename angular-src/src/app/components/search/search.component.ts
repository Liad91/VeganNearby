import {
  Component,
  OnInit,
  Output,
  ViewChild,
  ElementRef,
  EventEmitter,
  Renderer2
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';

import { YelpFilter, YelpSearchParams } from './../../models/yelp.model';
import { FiltersService } from '../../pages/places/filters/filters.service';
import { PlacesService } from '../../pages/places/places.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public location: string;
  public locateSpinner = false;
  public locateFailed = false;
  private searching = false;
  public categories: YelpFilter[];
  public selectedCategory: YelpFilter;
  public selectedCategoryIndex: number;
  @ViewChild('search') private searchElementRef: ElementRef;
  @Output() private categoryChanged = new EventEmitter();

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
  }

  private buildLocationAutocomplete(): void {
    this.mapsApiLoader.load()
      .then(() => {
        const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ['(cities)']
        });

        autocomplete.addListener('place_changed', () => {
          this.location = autocomplete.getPlace().formatted_address;
        });
      })
      .catch(error => this.geoError());
  }

  private geoSuccess(position: Position): void {

    this.placesService.geocoder(position.coords.latitude, position.coords.longitude)
      .then((location: string) => {
        this.locateSpinner = false;
        this.location = location;
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
      this.location = event.target.value;
    }
  }

  public onCategoryChange(): void {
    if (this.selectedCategory.alias !== this.categories[this.selectedCategoryIndex].alias) {
      Object.assign(this.selectedCategory, this.categories[this.selectedCategoryIndex]);
      this.categoryChanged.emit();
    }
  }

  public onSubmit(): void {
    if (this.searching) {
      return;
    }
    if (!this.location) {
      this.renderer.selectRootElement(this.searchElementRef.nativeElement).focus();
      return;
    }

    const params: YelpSearchParams = {
      location: this.location,
      categories: this.selectedCategory.alias,
      radius: 2500
    }

    this.searching = true;
    this.filtersService.reset();
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

  private searchSuccess(response) {
    this.searching = false;
    if (response.error) {
      this.toastService.show(response.error.description);
      return;
    }
    this.router.navigate(['/places']);
  }
}
