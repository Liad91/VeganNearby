import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { PlacesService } from './places.service';
import { YelpSearchResponse, YelpFilter, YelpSearchParams } from '../../models/yelp.model';
import { ToastService } from './../../services/toast.service';
import { FiltersService } from './filters/filters.service';

@Component({
	selector: 'app-places',
	templateUrl: './places.component.html',
	styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit, OnDestroy {
	public data: YelpSearchResponse
	public selectedLocation: { name: string };
	public selectedCategory: YelpFilter;
	private updateSubscription: Subscription;
	private changesSubscription: Subscription;
	public loading = false;
	public currentPage = 1;
	public itemsPerPage = 20;

	constructor(private placesService: PlacesService, private toastService: ToastService, private filtersService: FiltersService) {}

	ngOnInit() {
		this.data = this.placesService.data;
		this.selectedCategory = this.placesService.selectedCategory;
		this.selectedLocation = this.placesService.selectedLocation;

		this.changesSubscription = this.filtersService.changes.subscribe(
			(changes: YelpSearchParams) => this.updatePlaces(changes)
		);
		console.log(this.data.businesses);
	}

	private updatePlaces(params: YelpSearchParams) {
		this.loading = true;
		if (this.updateSubscription && !this.updateSubscription.closed) {
			this.updateSubscription.unsubscribe();
		}
		this.updateSubscription = this.placesService.search(params)
			.subscribe(
				response => this.updatePlacesSuccess(response),
				err => this.updatePlacesError()
			);
	}

	private updatePlacesSuccess(response) {
		this.loading = false;
		if (response.error) {
			this.toastService.show(response.error.description);
			return;
		}
	}

	private updatePlacesError() {
		this.loading = false;
		this.toastService.show('Something went wrong, please try again');
	}

	public isFiltered() {
		return this.filtersService.selectedPrices.length > 0 || this.filtersService.selectedCuisines.length > 0;
	}

	public onResetFilters() {
		this.filtersService.reset();
	}

	ngOnDestroy() {
		this.changesSubscription.unsubscribe();
		if (this.updateSubscription && !this.updateSubscription.closed) {
			this.updateSubscription.unsubscribe();
		}
	}
}
