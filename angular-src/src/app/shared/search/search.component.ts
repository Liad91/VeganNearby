import { Component, OnInit, ViewChild, ElementRef, EventEmitter, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { MzToastService } from 'ng2-materialize';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  outputs: ['search', 'category' ],
  inputs: ['selected'],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit {
  public location: string;
  public locateSpinner = false;  
  public selected;
  public selectedCategory;
  public search = new EventEmitter();
  public category = new EventEmitter();
  @ViewChild("search")
  public searchElementRef: ElementRef;
  @ViewChild("form")
  public form: NgForm;

  public categoryOptions = [ 
    { title: 'Restaurants', alias: 'restaurants' },
    { title: 'Cafes', alias: 'cafes' },
    { title: 'Bars', alias: 'bars' }
  ];

  constructor(private mapsApiLoader: MapsAPILoader, private toastService: MzToastService) {}

  ngOnInit() {
    this.buildLocationAutocomplete();
    this.setCategory();
  }

  private setCategory() {
    this.selectedCategory = this.categoryOptions.findIndex(category => category.alias === this.selected);
  }
  
  private buildLocationAutocomplete() {
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

  private geocodeSuccess(results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) {
    if (status.toString() === "OK" && results.length > 0) {
      if (results.length > 1) {
        this.location = results[1].formatted_address;
      }
      else {
        this.location = results[0].formatted_address;      
      }
    }
    else {
      this.geoError();
    }
  }

  private geoSuccess(position: Position) {
    this.mapsApiLoader.load()
      .then(() => {
        const geocoder = new google.maps.Geocoder();
        const request: google.maps.GeocoderRequest = {
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        };

        geocoder.geocode(request, this.geocodeSuccess.bind(this));
        this.locateSpinner = false;
      })
      .catch(error => this.geoError());
  }

  private geoError() {
    this.showToast('Unable to retrieve your location');
    this.locateSpinner = false;
  }

  private showToast(message: string) {
    this.toastService.show(message, 2500);
  }

  public getLocation() {
    if (!navigator.geolocation) {
      this.showToast('Geolocation is not supported by your browser');
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

  public onCategoryChange() {
    this.category.next(this.categoryOptions[this.selectedCategory]);
  }

  public onSubmit() {
    this.search.next({
      location: this.location,
      category: this.categoryOptions[this.selectedCategory]
    });
  }
}
