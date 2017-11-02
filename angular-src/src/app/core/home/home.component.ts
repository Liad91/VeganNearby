import { YelpBusinessResponse } from '../../models/yelp.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LatLngLiteral } from '@agm/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';

import { State } from './store/home.reducers';
import * as homeActions from './store/home.actions';
import * as fromRoot from '../../store/app.reducers';
import { PlacesService } from '../../places/places.service';
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
  public state: Observable<State>
  public category: Filter;
  public strings: string[];

  public recomendedPlaces = [
    'mortys-delicatessen-san-francisco',
    'grano-frutta-e-farina-roma',
    'grilld-healthy-burgers-sydney',
    'surya-new-york-3'
  ];

  constructor(private store: Store<fromRoot.AppState>, private router: Router, private placesService: PlacesService) {}

  ngOnInit(): void {
    this.state = this.store.select(fromRoot.selectHome);
    this.categorySubscription = this.store.select(fromRoot.selectSearchselectedCategory).subscribe(
      category => {
        this.category = category;
        this.setStrings();
      }
    );

    this.state
      .filter(state => !state.places)
      .take(1)
      .subscribe(() => this.store.dispatch(new homeActions.GetPlaces(this.recomendedPlaces)));
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
    const payload = {
      location,
      coordinates: null
    };

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
    this.router.navigate(['places', location], {
      queryParams: {
        p: 1,
        ...payload.coordinates
      }
    });
  }

  public onReload() {
    this.store.dispatch(new homeActions.GetPlaces(this.recomendedPlaces));
  }

  ngOnDestroy(): void {
    this.categorySubscription.unsubscribe();
  }
}
