import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { MapsAPILoader, LatLngLiteral } from '@agm/core';
import { Observable } from 'rxjs/Observable';
import * as yelp from 'yelp-fusion';
import 'rxjs/Rx';

import { categories } from './data/index';
import { ConnectionService } from '../../services/connection.service';
import {
	YelpSearchParams,
	YelpSearchResponse,
	YelpFilter
} from '../../models/yelp.model';

@Injectable()
export class PlacesService {
	public data = new YelpSearchResponse;
	public categories: YelpFilter[];
	public selectedCategory: YelpFilter;
	public selectedLocation = { name: '' };

	constructor(private http: Http, private connectionService: ConnectionService, private mapsApiLoader: MapsAPILoader) {
		this.categories = categories;
		this.selectedCategory = Object.assign({}, this.categories[0]);
	}

	public search(params: YelpSearchParams): Observable<YelpSearchResponse> {
		if (params.location) {
			this.selectedLocation.name = params.location;
		}

		return this.http.post(`${this.connectionService.serverUrl}/yelp/search`, params)
			.timeout(this.connectionService.reqTimeout)
			.map(this.connectionService.extractData)
			.do((response: YelpSearchResponse) => Object.assign(this.data, response))
			.catch(this.connectionService.catchError);
	}

	public geocoder(lat: number, lng: number): Promise<string> {
		return new Promise((resolve, reject) => {
			this.mapsApiLoader.load()
			.then(() => {
				const geocoder = new google.maps.Geocoder();
				const request: google.maps.GeocoderRequest = {
					location: {
						lat,
						lng
					}
				};

				geocoder.geocode(request, this.geocoderSuccess.bind(this, resolve, reject));
			})
			.catch(error => reject());
		});
	}

	private geocoderSuccess(resolve, reject, results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus): void {
		if (status.toString() === 'OK' && results.length > 0) {
			if (results.length > 1) {
				resolve(results[1].formatted_address);
			}
			else {
				resolve(results[0].formatted_address);
			}
		}
		else {
			reject();
		}
	}
}
