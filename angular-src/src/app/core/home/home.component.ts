import { YelpBusinessResponse } from '../../models/yelp.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LatLngLiteral } from '@agm/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';

import { State } from './store/home.reducer';
import * as homeActions from './store/home.actions';
import * as fromRoot from '../../store/app.reducer';
import { UtilitiesService } from '../services';
import { PlacesService } from '../../places/places.service';
import { Filter } from '../../places/filters/store/filters.reducer';
import { NewSearch } from '../../places/filters/store/filters.actions';
import { GetPlaces } from '../../places/place-list/store/place-list.actions';

interface Banner {
  checked: boolean;
  icon: string;
  title: string;
  subtitle: string;
  text: string;
}

@Component({
  selector: 'vn-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private categorySubscription: Subscription;
  private mobileView: Observable<boolean>;
  public state: Observable<State>
  public category: Filter;
  public strings: string[];
  public bannerOpen = false;

  public recomendedPlaces = [
    'mortys-delicatessen-san-francisco',
    'grano-frutta-e-farina-roma',
    'grilld-healthy-burgers-sydney',
    'surya-new-york-3'
  ];

  public banners: Banner[] = [
    {
      checked: false,
      icon: 'assets/icons/earth.png',
      title: 'for the planet',
      subtitle: 'Fight against climate change.',
      text: `
        Meat is not green. Consuming meat is actually one of the worst things that you can do for the Earth.
        It is wasteful and causes enormous amounts of pollution,
        and the meat industry is also one of the biggest causes of climate change.
        Adopting a vegan diet is more effective than switching to a “greener” car in the fight against climate change.`
    },
    {
      checked: false,
      icon: 'assets/icons/cow.png',
      title: 'for the animales',
      subtitle: 'Save more than 100 animals a year.',
      text: `
        Did you know that every vegan saves more than 100 animals a year?
        There is simply no easier way to help animals and prevent suffering than by choosing vegan foods over meat, eggs,
        and dairy products.`
    },
    {
      checked: false,
      icon: 'assets/icons/peace.png',
      title: 'for nonviolence',
      subtitle: 'All living creatures fear death.',
      text: `
        It's tempting to want to believe that the meat we eat is ethical, that our 'food animals' have lived full,
        happy lives and that they have experienced no pain or fear at the slaughterhouse.
        Yet the sad truth is that all living creatures (even those labelled 'free range' or 'organic') fear death, just as we do.
        No matter how they are treated when alive, they all experience the same fear when it comes to slaughter.`
    },
    {
      checked: false,
      icon: 'assets/icons/health.png',
      title: 'for yourself',
      subtitle: 'Vegan diet is great for your health.',
      text: `
        A vegan diet is great for your health! According to the Academy of Nutrition and Dietetics,
        vegans are less likely to develop heart disease, cancer, diabetes, or high blood pressure than meat-eaters are.
        Vegans get all the nutrients that they need to be healthy, such as plant protein, fiber, and minerals,
        without all the nasty stuff in meat that slows you down and makes you sick, such as cholesterol and saturated animal fat.`
    },
  ];

  constructor(
    private store: Store<fromRoot.AppState>,
    private utilitiesService: UtilitiesService,
    private placesService: PlacesService) {}

  ngOnInit(): void {
    this.state = this.store.select(fromRoot.selectHome);
    this.mobileView = this.utilitiesService.screenSize.map(size => size === 'sm' || size === 'xs');

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

  public flipBanner(banner: Banner) {
    if (!banner.checked) {
      this.banners.forEach(item => item.checked = false);
      banner.checked = true;
      this.bannerOpen = true;
    }
    else {
      banner.checked = false;
      this.bannerOpen = false;
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
    this.utilitiesService.navigate(['places', location], {
      queryParams: {
        p: 1,
        ...payload.coordinates
      }
    }, { scroll: true });
  }

  public onReload() {
    this.store.dispatch(new homeActions.GetPlaces(this.recomendedPlaces));
  }

  ngOnDestroy(): void {
    this.categorySubscription.unsubscribe();
  }
}
