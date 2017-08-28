import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { PlacesService } from './places.service';
import { YelpSearchResponse, YelpFilter, YelpSearchParams } from '../../models/yelp.model';
import { ToastService } from './../../services/toast.service';
import { FiltersService } from './filters/filters.service';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit, OnDestroy {
  public data: YelpSearchResponse
  public selectedLocation: { name: string };
  public selectedCategory: YelpFilter;
  private updateSubscription: Subscription;
  private changesSubscription: Subscription;
  public loading = false;
  public currentPage = 1;
  public itemsPerPage = 20;

  constructor(private placesService: PlacesService, private toastService: ToastService, private filtersService: FiltersService) {}

  ngOnInit(): void {
    this.data = this.placesService.data;
    this.selectedCategory = this.placesService.selectedCategory;
    this.selectedLocation = this.placesService.selectedLocation;

    this.changesSubscription = this.filtersService.changes.subscribe(
      (changes: YelpSearchParams) => this.updatePlaces(changes)
    );
  }

  private updatePlaces(params: YelpSearchParams): void {
    this.loading = true;
    if (this.updateSubscription && !this.updateSubscription.closed) {
      this.updateSubscription.unsubscribe();
    }
    this.updateSubscription = this.placesService.search(params)
      .subscribe(
        response => this.updatePlacesSuccess(response),
        err => this.updatePlacesError()
      );
  }

  private updatePlacesSuccess(response): void {
    this.loading = false;
    if (response.error) {
      this.toastService.show(response.error.description);
      return;
    }
  }

  private updatePlacesError(): void {
    this.loading = false;
    this.toastService.show('Something went wrong, please try again');
  }

  public isFiltered(): boolean {
    return this.filtersService.selectedPrices.length > 0 || this.filtersService.selectedCuisines.length > 0;
  }

  public onResetFilters(): void {
    this.filtersService.reset();
  }

  ngOnDestroy(): void {
    this.changesSubscription.unsubscribe();
    if (this.updateSubscription && !this.updateSubscription.closed) {
      this.updateSubscription.unsubscribe();
    }
  }
}
