import { error } from 'util';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';
import * as yelp from 'yelp-fusion';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/observable/forkJoin';

import { ConnectionService } from './../core/services/connection.service';
import {
  YelpSearchParams,
  YelpSearchResponse,
  YelpBusinessResponse,
  YelpBusiness
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

  public getFavorites(favorites: string[]): Observable<YelpBusiness[]> {
    const requests: Observable<YelpBusiness>[] = [];

    favorites.forEach(id => {
      const request = this.http.get<YelpBusiness>(`${this.connectionService.serverUrl}/yelp/business`, {
        params: new HttpParams().set('id', id)
      })
        .timeout(this.connectionService.reqTimeout)
        .retry(2)
        .catch(() => of(this.catchFavoriteError(id)));

      requests.push(request);
    });
    return Observable.forkJoin(requests);
  }

  private catchFavoriteError(id: string) {
    const place = new YelpBusiness();

    place.id = id;
    return place;
  }

  public addToFavorites(id: string): Observable<any> {
    return this.http.put(`${this.connectionService.serverUrl}/users/favorites/add`, { id }, {
      headers: new HttpHeaders().set('Authorization', localStorage.getItem('token'))
    })
      .timeout(this.connectionService.reqTimeout);
  }

  public removeFromFavorites(id: string): Observable<any> {
    return this.http.put(`${this.connectionService.serverUrl}/users/favorites/remove`, { id }, {
      headers: new HttpHeaders().set('Authorization', localStorage.getItem('token'))
    })
      .timeout(this.connectionService.reqTimeout);
  }

  public removeManyFromFavorites(ids: string[]): Observable<any> {
    const requests: Observable<any>[] = [];

    ids.forEach(id => {
      const request = this.http.put(`${this.connectionService.serverUrl}/users/favorites/remove`, { id }, {
        headers: new HttpHeaders().set('Authorization', localStorage.getItem('token'))
      }).timeout(this.connectionService.reqTimeout);

      requests.push(request);
    });
    return Observable.forkJoin(requests);
  }

  public getPlaceById(id: string): Observable<YelpBusinessResponse> {
    return this.http.get<YelpBusinessResponse>(`${this.connectionService.serverUrl}/yelp/business`, {
      params: new HttpParams().set('id', id)
    })
      .timeout(this.connectionService.reqTimeout)
  }
}