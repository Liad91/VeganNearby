import { MapsAPILoader, LatLngLiteral } from '@agm/core';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as yelp from 'yelp-fusion';
import 'rxjs/Rx';


import { ConnectionService } from '../../services/connection.service';
import { YelpSearchRequest, YelpSearchResponse } from '../../models/yelp.model';

@Injectable()
export class PlacesService {
  public data = new YelpSearchResponse;
  public location: string;
  public category: string;

  constructor(private http: Http, private connectionService: ConnectionService, private mapsApiLoader: MapsAPILoader) {}

  public search(location: string , term: string): Observable<YelpSearchResponse> {
    const data: YelpSearchRequest = {
      term
    };

    data.location = location;
    return this.http.post(`${this.connectionService.serverUrl}/yelp/search`, data)
      .timeout(this.connectionService.reqTimeout)
      .map(this.connectionService.extractData)
      .do((response: YelpSearchResponse) => this.searchSuccess(response, location, term))
      .catch(this.connectionService.catchError);
  }

  private searchSuccess(response: YelpSearchResponse, location: string, category: string) {
    Object.assign(this.data, response);
    this.location = location;
    this.category = category;
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
        resolve(this.location = results[0].formatted_address);
      }
    }
    else {
      reject();
    }
  }
}
