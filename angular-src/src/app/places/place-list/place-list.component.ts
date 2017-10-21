import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { State } from './store/place-list.reducers';
import * as fromPlaces from '../store/places.reducers';
import * as placeListActions from './store/place-list.actions';
import * as filtersActions from '../filters/store/filters.actions';
import { Filter } from '../filters/store/filters.reducers';
import { ResizeService } from '../../core/services/resize.service';
import { placeStateTrigger } from './animations';

@Component({
  selector: 'vn-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.scss'],
  animations: [
    placeStateTrigger
  ]
})
export class PlaceListComponent implements OnInit, OnDestroy {
  @ViewChild('sidebarBtn') sidebarBtn: ElementRef;
  public state: Observable<State>;
  public mobileView: boolean;
  public location: Observable<string>;
  public category: Observable<Filter>;
  public filtersApplied: Observable<boolean>;
  private resizeSubscription: Subscription;

  constructor(private store: Store<fromPlaces.FeatureState>, private resizeService: ResizeService) {}

  ngOnInit(): void {
    this.state = this.store.select(fromPlaces.selectPlaceList);
    this.location = this.store.select(fromPlaces.selectFiltersLocation);
    this.category = this.store.select(fromPlaces.selectFiltersCategory);
    this.filtersApplied = this.store.select(fromPlaces.selectFiltersApplied);
    this.resizeSubscription = this.resizeService.screenSize.subscribe(size => this.onScreenResize(size));
  }

  private onScreenResize(size: string): void {
    this.mobileView = size === 'sm' || size === 'xs';
  }

  public onReload(): void {
    this.store.dispatch(new placeListActions.GetPlaces());
  }

  public trackById(index, item) {
    return item.id;
  }

  public onPageChange(page: number): void {
    this.store.dispatch(new placeListActions.SetCurrentPage(page));
    this.store.dispatch(new filtersActions.SetOffset(18 * (page - 1)));
    this.store.dispatch(new placeListActions.GetPlaces());
  }

  public onResetFilters(): void {
    this.store.dispatch(new filtersActions.ResetFilters());
    this.store.dispatch(new placeListActions.GetPlaces());
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }
}
