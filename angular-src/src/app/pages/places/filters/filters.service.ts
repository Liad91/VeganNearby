import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { YelpFilter, YelpSearchParams } from './../../../models/yelp.model';
import { cuisinesSlice } from './../data/index';

@Injectable()
export class FiltersService {
	public cuisines: YelpFilter[] = cuisinesSlice;
	public selectedCuisines: string[] = [];
	public selectedPrices: string[] = [];
	public changes = new Subject<YelpSearchParams>();
	public updated = new Subject<void>();

	public updateCuisines(cuisines: YelpFilter[]) {
		this.selectedCuisines.splice(0, this.selectedCuisines.length);

		cuisines.forEach(cuisine => {
			const index = this.cuisines.findIndex(value => value.alias === cuisine.alias);

			if (index > -1) {
				this.cuisines.splice(index, 1);
			}
			this.selectedCuisines.push(cuisine.alias);
		});

		this.cuisines.unshift(...cuisines);
		this.cuisines.splice(5, this.cuisines.length);
		this.cuisines.sort((a, b) => +(a.title > b.title));
		this.updated.next();
	}

	public reset() {
		this.selectedCuisines.splice(0, this.selectedCuisines.length);
		this.selectedPrices.splice(0, this.selectedPrices.length);
		this.updated.next();
	}
}
