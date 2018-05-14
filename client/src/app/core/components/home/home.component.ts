import { LatLngLiteral } from '@agm/core';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { NewSearch } from '../../../places/components/filters/store/filters.actions';
import { Filter } from './../../../models/filter.model';
import { ResetPlaces } from '../../../places/components/place-list/store/place-list.actions';
import * as fromRoot from '../../../store/app.reducer';
import { UtilitiesService } from '../../services/utilities.service';
import { categoryStateTrigger } from './animations';
import * as homeActions from './store/home.actions';
import { State } from './store/home.reducer';

@Component({
  selector: 'vn-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    categoryStateTrigger
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  private categorySubscription: Subscription;
  private mobileViewSubscriptoin: Subscription;
  public mobileView: boolean;
  private stateSubscription: Subscription;
  public state: State;
  public category: Filter;
  public strings: string[];

  public carouselOptions: OwlCarousel.Options = {
    responsive: {
      0: {
        items: 1
      },
      560: {
        items: 2
      },
      830: {
        items: 3
      },
      1300: {
        items: 3,
        nav: true
      }
    }
  };

  constructor(
    private store: Store<fromRoot.AppState>,
    private utilitiesService: UtilitiesService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.stateSubscription = this.store.select(fromRoot.selectHome).subscribe(
      state => {
        this.state = state;
        this.changeDetectorRef.markForCheck();
      }
    );

    this.mobileViewSubscriptoin = this.utilitiesService.screenSize.pipe(
      map(size => size === 'sm' || size === 'xs')
    ).subscribe(
      mobileView => {
        this.mobileView = mobileView;
        this.changeDetectorRef.markForCheck();
      }
    );

    this.categorySubscription = this.store.select(fromRoot.selectSearchselectedCategory).subscribe(
      category => {
        this.category = category;
        this.setStrings();
      }
    );

    if (!this.state.featured.length) {
      this.store.dispatch(new homeActions.GetFeatured());
    }
  }

  private setStrings() {
    switch (this.category.alias) {
      case 'restaurants':
        this.strings = [
          `Find the best ${this.category.alias}^1000`,
          `Find the most rated ${this.category.alias}^1000`,
          `Find your favorite ${this.category.alias}^1000`
        ];
        break;
      case 'cafes':
        this.strings = [
          `Find ${this.category.alias} with the most richest breakfast^1000`,
          `Find ${this.category.alias} with wifi^1000`,
          `Find your perfect ${this.category.alias}^1000`
        ];
        break;
      case 'bars':
        this.strings = [
          `Find the most popular ${this.category.alias}^1000`,
          `Find ${this.category.alias} with the best liquors^1000`,
          `Find the most crowded ${this.category.alias}^1000`
        ];
    }
  }

  public searchCity(location: string): void {
    let coordinates: LatLngLiteral;

    switch (location) {
      case 'New York, NY, USA':
        coordinates = { lat: 40.7127753, lng: -74.0059728 };
        break;
      case 'Los Angeles, CA, USA':
        coordinates = { lat: 34.0522342, lng: -118.2436849 };
        break;
      case 'Toronto, ON, Canada':
        coordinates = { lat: 43.653226, lng: -79.38318429999998 };
        break;
      case 'Berlin, Germany':
        coordinates = { lat: 52.52000659999999, lng: 13.404953999999975 };
        break;
      case 'London, UK':
        coordinates = { lat: 51.5073509, lng: -0.12775829999998223 };
    }

    this.store.dispatch(new ResetPlaces());
    this.store.dispatch(new NewSearch({ location, coordinates }));
    this.utilitiesService.navigate(['places', location], { queryParams: { p: 1, ...coordinates } }, { scroll: true });
  }

  public onReload() {
    this.store.dispatch(new homeActions.GetFeatured());
  }

  ngOnDestroy(): void {
    this.stateSubscription.unsubscribe();
    this.mobileViewSubscriptoin.unsubscribe();
    this.categorySubscription.unsubscribe();
  }
}
