import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ResizeService } from './../../../services/rezise.service';
import { FiltersService } from './filters/filters.service';
import { PlacesService } from '../places.service';
import { ToastService } from '../../../services/toast.service';
import { sidebarStateTrigger, listStateTrigger } from '../animations';
import { PlacesListState } from '../places.model';
import {
  YelpSearchResponse,
  YelpBusinessResponse,
  YelpFilter,
  YelpSearchParams
} from '../../../models/yelp.model';

@Component({
  selector: 'vn-places-list',
  templateUrl: './places-list.component.html',
  styleUrls: ['./places-list.component.scss'],
  animations: [
    sidebarStateTrigger,
    listStateTrigger
  ]
})
export class PlacesListComponent implements OnInit, OnDestroy {
  public mobileView: boolean;
  public state: PlacesListState;
  public data: YelpSearchResponse
  private updateSubscription: Subscription;
  private changesSubscription: Subscription;
  private resizeSubscription: Subscription;
  public sidebarOpen = false;
  public loading = false;

  constructor(
    private resizeService: ResizeService,
    private placesService: PlacesService,
    private toastService: ToastService,
    private filtersService: FiltersService) {}

  ngOnInit(): void {
    this.data = this.placesService.data;
    this.state = this.placesService.placesListState;

    this.resizeSubscription = this.resizeService.screenSize.subscribe(
      size => this.mobileView = size === 'sm' || size === 'xs'
    );

    this.changesSubscription = this.filtersService.changes.subscribe(
      changes => this.onFilterChange(changes)
    );

    if (!this.state.listView) {
      this.state.listView = this.mobileView ? 'list' : 'grid';
    }
  }

  private onFilterChange(params: YelpSearchParams) {
    this.state.currentPage = 1;
    this.updatePlaces(params)
  }

  private updatePlaces(params: YelpSearchParams): void {
    this.loading = true;
    if (this.updateSubscription) {
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

  public trackById(index, item) {
    return item.id;
  }

  public onPageChange(page: number) {
    const params = this.filtersService.state.getValue();

    params.limit = this.state.itemsPerPage;
    params.offset = this.state.currentPage * (page - 1);
    this.updatePlaces(params);
  }

  public isFiltered(): boolean {
    return this.filtersService.selectedPrices.length > 0 || this.filtersService.selectedCuisines.length > 0;
  }

  public onResetFilters(): void {
    if (this.mobileView) {
      this.sidebarOpen = true;
    }
    else {
      this.filtersService.reset();
    }
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
    this.changesSubscription.unsubscribe();
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }
}
