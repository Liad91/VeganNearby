import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  ElementRef,
  EventEmitter,
  Renderer2
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';

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
  public selectedCategoryIndex;
  @Input() public selected;
  @Output() public category = new EventEmitter();
  @ViewChild('search') public searchElementRef: ElementRef;

  public categories = ['restaurants', 'cafes', 'bars'];

  constructor(private renderer: Renderer2,
              private router: Router,
              private placesService: PlacesService,
              private mapsApiLoader: MapsAPILoader,
              private toastService: ToastService) {}

  ngOnInit(): void {
    this.buildLocationAutocomplete();
    this.setCategory();
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

  private setCategory(): void {
    this.selectedCategoryIndex = this.categories.findIndex(category => category === this.selected);
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
    this.category.next(this.categories[this.selectedCategoryIndex]);
  }

  public onSubmit(): void {
    if (this.searching) {
      return;
    }
    if (!this.location) {
      this.renderer.selectRootElement(this.searchElementRef.nativeElement).focus();
      return;
    }
    this.searching = true;
    this.placesService.search(this.location, this.categories[this.selectedCategoryIndex])
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
