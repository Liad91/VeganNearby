import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Subscription } from 'rxjs/Subscription';

import { PlacesStatus } from './places.model';
import { PlacesService } from './places.service';
import { FiltersService } from './filters/filters.service';
import { ToastService } from './../../services/toast.service';
import { sidebarStateTrigger } from './animations';
import { YelpSearchResponse, YelpFilter, YelpSearchParams } from '../../models/yelp.model';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss'],
  animations: [
    sidebarStateTrigger
  ]
})
export class PlacesComponent implements OnInit, OnDestroy {
  public status: PlacesStatus;
  public data: YelpSearchResponse
  public selectedLocation: { name: string };
  public selectedCategory: YelpFilter;
  private updateSubscription: Subscription;
  private changesSubscription: Subscription;
  private mediaSubscription: Subscription;
  public isSmallScreen: boolean;
  public sidebarOpen = false;
  public loading = false;

  constructor(
    private media: ObservableMedia,
    private placesService: PlacesService,
    private toastService: ToastService,
    private filtersService: FiltersService) {}

  ngOnInit(): void {
    this.data = this.placesService.data;
    this.selectedCategory = this.placesService.selectedCategory;
    this.selectedLocation = this.placesService.selectedLocation;
    this.status = this.placesService.viewStatus;

    this.mediaSubscription = this.media.subscribe(
      (change: MediaChange) => {
        this.isSmallScreen = change.mqAlias === 'sm' || change.mqAlias === 'xs';
        if (!this.status.listView) {
          this.status.listView = this.isSmallScreen ? 'list' : 'grid';
        }
      }
    );

    this.changesSubscription = this.filtersService.changes.subscribe(
      (changes: YelpSearchParams) => this.updatePlaces(changes)
    );
    console.log(this.data.businesses)
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

  public getDisplayedItemsStatus() {
    const status = this.status;
    const from = status.currentPage * status.itemsPerPage - status.itemsPerPage + 1;
    let to: string;

    if (status.currentPage *  status.itemsPerPage < this.data.total) {
      to = `${status.currentPage *  status.itemsPerPage}`;
    }
    else {
      to = `${this.data.total}`;
    }

    return `${from} - ${to} of ${this.data.total}`;
  }

  public isFiltered(): boolean {
    return this.filtersService.selectedPrices.length > 0 || this.filtersService.selectedCuisines.length > 0;
  }

  public onResetFilters(): void {
    if (!this.isSmallScreen) {
      this.filtersService.reset();
    }
    else {
      this.sidebarOpen = true;
    }
  }

  ngOnDestroy(): void {
    this.mediaSubscription.unsubscribe();
    this.changesSubscription.unsubscribe();
    if (this.updateSubscription && !this.updateSubscription.closed) {
      this.updateSubscription.unsubscribe();
    }
  }
}
