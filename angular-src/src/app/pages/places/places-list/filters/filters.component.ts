import { cuisines } from './../../data';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LatLngLiteral, LatLngBounds, MapsAPILoader } from '@agm/core';
import { MzModalService } from 'ng2-materialize';
import { Subscription } from 'rxjs/Subscription';

import { categories } from '../../data/index';
import { FiltersService } from './filters.service';
import { PlacesService } from '../../places.service';
import { YelpSearchResponse, YelpSearchParams, YelpFilter } from '../../../../models/yelp.model';
import { CuisinesComponent } from './cuisines/cuisines.component';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {
  public data: YelpSearchResponse;
  public categories: YelpFilter[];
  public selectedCategory: YelpFilter;
  public prices: YelpFilter[];
  public selectedPrices: string[];
  public cuisines: YelpFilter[];
  public selectedCuisines: string[];
  public mapCenter: LatLngLiteral;
  public mapBounds: LatLngBounds;
  private updates: Subscription;
  public mapDraggable = true;
  private mapRadius = 2500;

  constructor(
    private filtersService: FiltersService,
    private placesService: PlacesService,
    private mapsApiLoader: MapsAPILoader,
    private modalService: MzModalService) {}

  ngOnInit(): void {
    this.data = this.placesService.data;
    this.categories = categories;
    this.prices = this.filtersService.prices;
    this.cuisines = this.filtersService.cuisines;
    this.selectedCategory = this.placesService.selectedCategory;
    this.selectedPrices = this.filtersService.selectedPrices;
    this.selectedCuisines = this.filtersService.selectedCuisines;
    this.mapCenter = {
      lat: this.data.region.center.latitude,
      lng: this.data.region.center.longitude
    }
    this.updates = this.filtersService.updated.subscribe(
      () => this.emitFiltersChanges()
    );
  }

  public onIdle(): void {
    const currentPosition = this.data.region.center;

    if (this.mapCenter.lat !== currentPosition.latitude || this.mapCenter.lng !== currentPosition.longitude) {
      this.placesService.geocoder(this.mapCenter.lat, this.mapCenter.lng)
        .then((location: string) => {
          this.placesService.selectedLocation.next(location);
          return this.getRadius();
        })
        .then((radius: number) => {
          this.mapRadius = radius;
          this.emitFiltersChanges();
        })
        .catch(error => this.emitFiltersChanges());
    }
  }

  public onCategoryChanged(index: number): void {
    Object.assign(this.selectedCategory, this.categories[index]);
    this.emitFiltersChanges();
  }

  public onFilterChanged(selected: string[], filter: YelpFilter): void {
    filter.checked = !filter.checked;

    if (filter.checked) {
      selected.push(filter.alias);
    }
    else {
      selected.splice(selected.indexOf(filter.alias), 1);
    }
    this.emitFiltersChanges();
  }

  public openModal(): void {
    this.modalService.open(CuisinesComponent);
  }

  private getRadius(): Promise<number> {
    const from = new google.maps.LatLng(this.mapCenter.lat, this.mapCenter.lng);
    const to = new google.maps.LatLng(this.mapBounds.getNorthEast().lat(), this.mapBounds.getNorthEast().lng());

    return new Promise((resolve, reject) => {
      this.mapsApiLoader.load()
        .then(() => {
          resolve(Math.floor(google.maps.geometry.spherical.computeDistanceBetween(from, to) / 2.2));
        });
    })
  }

  private emitFiltersChanges(): void {
    const params = new YelpSearchParams();

    params.latitude = this.mapCenter.lat;
    params.longitude = this.mapCenter.lng;
    params.radius = this.mapRadius;
    params.price = this.selectedPrices.join(', ');
    if (this.selectedCategory.alias === 'restaurants' && this.selectedCuisines.length > 0) {
      params.categories = this.selectedCuisines.join(',');
    }
    else {
      params.categories = this.selectedCategory.alias;
    }

    this.filtersService.state.next(params);
    this.filtersService.changes.next(params);
  }

  ngOnDestroy() {
    this.updates.unsubscribe();
  }
}
