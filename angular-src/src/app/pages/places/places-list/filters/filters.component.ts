import { cuisines } from './../../data';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { LatLngLiteral, LatLngBounds, MapsAPILoader, GoogleMapsAPIWrapper, AgmMap } from '@agm/core';
import { MzModalService } from 'ng2-materialize';
import { Subscription } from 'rxjs/Subscription';

import { categories } from '../../data/index';
import { FiltersService } from './filters.service';
import { PlacesService } from '../../places.service';
import { YelpSearchResponse, YelpSearchParams, YelpFilter } from '../../../../models/yelp.model';
import { CuisinesComponent } from './cuisines/cuisines.component';

@Component({
  selector: 'vn-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {
  @ViewChild(AgmMap) map: any;
  public data: YelpSearchResponse;
  public categories: YelpFilter[];
  public selectedCategory: YelpFilter;
  public prices: YelpFilter[];
  public selectedPrices: string[];
  public cuisines: YelpFilter[];
  public selectedCuisines: string[];
  public mapCenter: LatLngLiteral;
  public mapBounds: LatLngBounds;
  private updateMapSubscription: Subscription;
  private updateFiltersSubscription: Subscription;
  private dragEndSubscription: Subscription;
  public updateOnDrag = true;
  private mapRadius = 1489;

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

    this.updateFiltersSubscription = this.filtersService.updateFilters.subscribe(
      () => this.emitFiltersChanges()
    );

    this.updateMapSubscription = this.filtersService.updateMap.subscribe(
      () => this.setMapCenter()
    );

    this.setMapCenter();
    this.setDragEndListener();
  }

  // TODO: Remove setDragEndListener method and use (dragEnd) after https://github.com/SebastianM/angular-google-maps/pull/1147 will merged
  private setDragEndListener() {
    this.dragEndSubscription = (this.map._mapsWrapper as GoogleMapsAPIWrapper).subscribeToMapEvent('dragend').subscribe(
      () => this.onDragEnd()
    );
  }

  private setMapCenter() {
    this.mapCenter = {
      lat: this.data.region.center.latitude,
      lng: this.data.region.center.longitude
    };
  }

  public isFiltered(): boolean {
    return this.selectedPrices.length > 0 || this.selectedCuisines.length > 0;
  }

  public onResetFilters(): void {
    this.filtersService.reset();
  }

  public onDragEnd(): void {
    if (this.updateOnDrag) {
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
    });
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

    this.filtersService.searchState.next(params);
    this.filtersService.changes.next(params);
  }

  ngOnDestroy() {
    this.updateFiltersSubscription.unsubscribe();
    this.updateMapSubscription.unsubscribe();
    this.dragEndSubscription.unsubscribe();
  }
}
