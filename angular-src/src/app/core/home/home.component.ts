import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LatLngLiteral } from '@agm/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/take';

import * as fromRoot from '../../store/app.reducers';
import { Filter } from '../../places/filters/store/filters.reducers';
import { NewSearch } from '../../places/filters/store/filters.actions';
import { GetPlaces } from '../../places/place-list/store/place-list.actions';


@Component({
  selector: 'vn-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private categorySubscription: Subscription;
  public category: Filter;
  public strings: string[];

  constructor(private store: Store<fromRoot.AppState>, private router: Router) {}

  ngOnInit(): void {
    this.categorySubscription = this.store.select(fromRoot.selectSearchselectedCategory).subscribe(
      category => {
        this.category = category;
        this.setStrings();
      }
    );
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
    const payload: {location: string, selectedCategory: Filter, coordinates: LatLngLiteral} = {
      location,
      selectedCategory: null,
      coordinates: null
    };

    this.store.select(fromRoot.selectSearchCategories).take(1).subscribe(categories => payload.selectedCategory = categories[0]);

    switch (location) {
      case 'New York, NY, USA':
        payload.coordinates = {lat: 40.7127753, lng: -74.0059728};
        break;
      case 'Los Angeles, CA, USA':
        payload.coordinates = {lat: 34.0522342, lng: -118.2436849};
        break;
      case 'Toronto, ON, Canada':
        payload.coordinates = {lat: 43.653226, lng: -79.38318429999998};
        break;
      case 'Berlin, Germany':
        payload.coordinates = {lat: 52.52000659999999, lng: 13.404953999999975};
    }

    this.store.dispatch(new NewSearch(payload));
    this.store.dispatch(new GetPlaces());
    this.router.navigate(['places', 'list']);
  }

  ngOnDestroy(): void {
    this.categorySubscription.unsubscribe();
  }
}
