import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as yelp from 'yelp-fusion';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/observable/forkJoin';

import { ConnectionService } from './../core/services/connection.service';
import {
  YelpSearchParams,
  YelpSearchResponse,
  YelpBusinessResponse,
  YelpBusiness,
  YelpFilter
} from './../models/yelp.model';
import { State } from './filters/store/filters.reducers';

@Injectable()
export class PlacesService {

  constructor(private http: HttpClient, private connectionService: ConnectionService) {}

  public getPlaces(state: State) {
    const params = new YelpSearchParams();

    params.limit = state.limit;
    params.offset = state.offset;
    params.radius = state.radius;
    params.latitude = state.coordinates.lat;
    params.longitude = state.coordinates.lng;
    params.price = state.selectedPrices.join(', ');

    if (state.selectedCategory.alias === 'restaurants' && state.selectedCuisines.length > 0) {
      params.categories = state.selectedCuisines.join(',');
    }
    else {
      params.categories = state.selectedCategory.alias;
    }

    return this.http.post<YelpSearchResponse>(`${this.connectionService.serverUrl}/yelp/search`, params)
      .timeout(this.connectionService.reqTimeout);
  }

  // public getFavorites(): Observable<YelpBusiness[]> {
  //   const user = this.authService.currentUser.getValue();

  //   if (user) {
  //     const requests: Observable<YelpBusiness>[] = [];

  //     user.favorites.forEach(placeId => {
  //       const request = this.http.get<YelpBusiness>(`${this.connectionService.serverUrl}/yelp/business`, {
  //         params: new HttpParams().set('id', placeId)
  //       })
  //         .timeout(this.connectionService.reqTimeout)
  //         .retry();

  //       requests.push(request);
  //     })

  //     return Observable.forkJoin(requests);
  //   }
  // }

  // public addToFavorites(placeId: string): Observable<any> {
  //   return this.http.post(`${this.connectionService.serverUrl}/users/favorites/add`, { placeId }, {
  //     headers: new HttpHeaders().set('Authorization', this.authService.getToken())
  //   })
  //     .timeout(this.connectionService.reqTimeout);
  // }

  // public removeFromFavorites(placeId: string): Observable<any> {
  //   return this.http.post(`${this.connectionService.serverUrl}/users/favorites/remove`, { placeId }, {
  //     headers: new HttpHeaders().set('Authorization', this.authService.getToken())
  //   })
  //     .timeout(this.connectionService.reqTimeout);
  // }

  // public getPlaceById(id: string): Observable<YelpBusinessResponse> {
  //   return this.http.get<YelpBusinessResponse>(`${this.connectionService.serverUrl}/yelp/business`, {
  //     params: new HttpParams().set('id', id)
  //   })
  //     .timeout(this.connectionService.reqTimeout)
  // }
}
