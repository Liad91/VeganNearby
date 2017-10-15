import {
  Component,
  OnInit,
  OnDestroy,
  Renderer2
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { State } from './store/place-list.reducers';
import * as fromPlaces from '../store/places.reducers';
import * as placeListActions from './store/place-list.actions';
import * as filtersActions from '../filters/store/filters.actions';
import { Filter } from '../filters/store/filters.reducers';
import { ResizeService } from '../../core/services/resize.service';
import { sidebarStateTrigger, listStateTrigger } from '../animations';

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
  public state: Observable<State>;
  public mobileView: boolean;
  public sidebarOpen = false;
  public location: Observable<string>;
  public category: Observable<Filter>;
  public filtersApplied: Observable<boolean>;
  private resizeSubscription: Subscription;

  constructor(private store: Store<fromPlaces.FeatureState>, private resizeService: ResizeService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.state = this.store.select(fromPlaces.selectPlaceList);
    this.location = this.store.select(fromPlaces.selectFiltersLocation);
    this.category = this.store.select(fromPlaces.selectFiltersCategory);
    this.filtersApplied = this.store.select(fromPlaces.selectFiltersApplied);
    this.resizeSubscription = this.resizeService.screenSize.subscribe(size => this.onScreenResize(size));
  }

  private onScreenResize(size: string): void {
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
    if (this.sidebarOpen) {
      this.onCloseSidebar();
    }
  }
}
