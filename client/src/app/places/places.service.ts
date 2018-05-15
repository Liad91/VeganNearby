import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concat, forkJoin, from, Observable, throwError, observable, of } from 'rxjs';
import {
  catchError,
  delay,
  map,
  mapTo,
  retryWhen,
  scan,
  switchMap,
  timeout,
  toArray,
  takeWhile
} from 'rxjs/operators';

import { ConnectionService } from './../core/services/connection.service';
import {
  YelpBusinessResponse,
  YelpBusinessResponseError,
  YelpReviewsResponse,
  YelpSearchParams,
  YelpSearchResponse
} from './../models/yelp.model';
import { State } from './components/filters/store/filters.reducer';

@Injectable()
export class PlacesService {

  constructor(private http: HttpClient, private connectionService: ConnectionService) { }

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
      .pipe(
        timeout(this.connectionService.reqTimeout)
      );
  }

  public getFeaturedPlaces(): Observable<Array<YelpBusinessResponse | YelpBusinessResponseError>> {
    return this.http.get<{ places: string[] }>(`${this.connectionService.serverUrl}/yelp/featured`)
      .pipe(
        timeout(this.connectionService.reqTimeout),
        map(response => response.places),
        switchMap(places => this.getPlacesById(places))
      );
  }

  public getPlacesById(ids: string[]): Observable<Array<YelpBusinessResponse | YelpBusinessResponseError>> {
    const retryStrategy = () => {
      return (errors: Observable<any>) => {
        return errors.pipe(
          scan((acc, value: Error) => {
            if (++acc < 3) {
              return acc;
            }
            throw value;
          }, 0),
          delay(100)
        );
      };
    };

    const requests = ids.map((id, i) => {
      return this.getPlaceById(id).pipe(
        retryWhen(retryStrategy()),
        catchError(error => of({ error, id })),
        delay(100)
      );
    });

    return concat(...requests).pipe(
      toArray()
    );
  }

  public addToFavorites(id: string): Observable<YelpBusinessResponse> {
    return this.getPlaceById(id)
      .pipe(
        switchMap(response => {
          return this.http.put(`${this.connectionService.serverUrl}/users/favorites/add`, { id }, {
            headers: new HttpHeaders().set('Authorization', localStorage.getItem('token'))
          })
            .pipe(
              timeout(this.connectionService.reqTimeout),
              mapTo(response)
            );
        })
      );
  }

  public removeFromFavorites(id: string): Observable<any> {
    return this.http.put(`${this.connectionService.serverUrl}/users/favorites/remove`, { id }, {
      headers: new HttpHeaders().set('Authorization', localStorage.getItem('token'))
    })
      .pipe(
        timeout(this.connectionService.reqTimeout)
      );
  }

  public getPlaceById(id: string): Observable<YelpBusinessResponse> {
    return this.http.get<YelpBusinessResponse>(`${this.connectionService.serverUrl}/yelp/business`, {
      params: new HttpParams().set('id', id)
    })
      .pipe(
        timeout(this.connectionService.reqTimeout)
      );
  }

  public getReviewsById(id: string): Observable<YelpReviewsResponse> {
    return this.http.get<YelpReviewsResponse>(`${this.connectionService.serverUrl}/yelp/reviews`, {
      params: new HttpParams().set('id', id)
    })
      .pipe(
        timeout(this.connectionService.reqTimeout)
      );
  }

  public getPlaceDetail(id: string): Observable<(YelpReviewsResponse | YelpBusinessResponse)[]> {
    return forkJoin([this.getPlaceById(id), this.getReviewsById(id)]);
  }
}
