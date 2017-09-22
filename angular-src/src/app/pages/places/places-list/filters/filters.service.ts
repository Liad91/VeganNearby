import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { YelpFilter, YelpSearchParams } from './../../../../models/yelp.model';
import { displayedCuisines, prices } from './../../data/index';

@Injectable()
export class FiltersService {
  public cuisines: YelpFilter[] = displayedCuisines;
  public selectedCuisines: string[] = [];
  public prices: YelpFilter[] = prices;
  public selectedPrices: string[] = [];
  public searchState = new BehaviorSubject<YelpSearchParams>(new YelpSearchParams);
  public changes = new Subject<YelpSearchParams>();
  public updateFilters = new Subject<void>();
  public updateMap = new Subject<void>();

  public updateCuisines(updatedCuisines: YelpFilter[]): void {
    this.resetCuisines();

    updatedCuisines.forEach(cuisine => {
      this.selectedCuisines.push(cuisine.alias);
    });

    this.cuisines.unshift(...updatedCuisines);
    this.cuisines.splice(5, this.cuisines.length);
    this.cuisines.sort((a, b) => +(a.title > b.title));
    this.updateFilters.next();
  }

  private resetCuisines(): void {
    this.selectedCuisines.splice(0, this.selectedCuisines.length);
    this.cuisines.forEach(cuisine => {
      cuisine.checked = false;
    });
  }

  public reset(): void {
    this.resetCuisines();
    this.prices.forEach(cuisine => {
      cuisine.checked = false;
    });
    this.selectedPrices.splice(0, this.selectedPrices.length);
    this.updateFilters.next();
  }
}
