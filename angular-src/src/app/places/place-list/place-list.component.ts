import {
  Component,
  OnInit,
  OnDestroy,
  Renderer2
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ResizeService } from './../../core/services/resize.service';
import { FiltersService } from './filters/filters.service';
import { PlacesService } from './../places.service';
import { ToastService } from './../../core/services/toast.service';
import { sidebarStateTrigger, listStateTrigger } from '../animations';
import { PlacesState } from './../places.model';
import {
  YelpSearchResponse,
  YelpBusinessResponse,
  YelpFilter,
  YelpSearchParams
} from '../../models/yelp.model';

@Component({
  selector: 'vn-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.scss'],
  animations: [
    sidebarStateTrigger,
    listStateTrigger
  ]
})
export class PlaceListComponent implements OnInit, OnDestroy {
  public mobileView: boolean;
  public state: PlacesState;
  public data: YelpSearchResponse;
  public selectedLocation: string;
  public selectedCategory: YelpFilter;
  private locationSubscription: Subscription;
  private updateSubscription: Subscription;
  private changesSubscription: Subscription;
  private resizeSubscription: Subscription;
  public sidebarOpen = false;
  public loading = false;

  constructor(
    private resizeService: ResizeService,
    private placesService: PlacesService,
    private toastService: ToastService,
    private filtersService: FiltersService,
    private renderer: Renderer2) {}

  ngOnInit(): void {
    this.data = this.placesService.data;
    this.state = this.placesService.placesListState;
    this.selectedCategory = this.placesService.selectedCategory;

    this.resizeSubscription = this.resizeService.screenSize.subscribe(
      size => this.onScreenResize(size)
    );

    this.changesSubscription = this.filtersService.changes.subscribe(
      changes => this.onFilterChange(changes)
    );

    this.locationSubscription = this.placesService.selectedLocation.subscribe(
      location => this.selectedLocation = location
    )
  }

  private onScreenResize(size): void {
    this.mobileView = size === 'sm' || size === 'xs';
    if (this.sidebarOpen && !this.mobileView) {
      this.onCloseSidebar();
    }
  }

  public onOpenSidebar(): void {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.sidebarOpen = true;
  }

  public onCloseSidebar(): void {
    this.renderer.setStyle(document.body, 'overflow', 'auto');
    this.sidebarOpen = false;
  }

  private onFilterChange(params: YelpSearchParams): void {
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
    const params = this.filtersService.searchState.getValue();

    params.limit = this.state.itemsPerPage;
    params.offset = this.state.itemsPerPage * (page - 1);
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
    this.locationSubscription.unsubscribe();
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    if (this.sidebarOpen) {
      this.onCloseSidebar();
    }
  }
}
