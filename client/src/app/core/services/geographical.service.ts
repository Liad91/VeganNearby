import { LatLngLiteral, MapsAPILoader } from '@agm/core';
import { Injectable } from '@angular/core';

import { ToastService } from './toast.service';

@Injectable()
export class GeographicalService {

  constructor(private mapsApiLoader: MapsAPILoader, private toastService: ToastService) { }

  public geocoder(location: LatLngLiteral): Promise<string>;
  public geocoder(location: string): Promise<LatLngLiteral>;
  public geocoder(location: string | LatLngLiteral): Promise<string | LatLngLiteral> {
    if (typeof location === 'string') {
      return new Promise((resolve, reject) => {
        this.mapsApiLoader.load()
          .then(() => {
            const geocoder = new google.maps.Geocoder();
            const request: google.maps.GeocoderRequest = { address: location };

            geocoder.geocode(request, callback);
          })
          .catch(error => reject());

        function callback(results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) {
          if (status.toString() === 'OK') {
            resolve({
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            });
          }
          else {
            reject();
          }
        }
      });
    }
    else {
      return new Promise((resolve, reject) => {
        this.mapsApiLoader.load()
          .then(() => {
            const geocoder = new google.maps.Geocoder();
            const request: google.maps.GeocoderRequest = { location };

            geocoder.geocode(request, callback);
          })
          .catch(error => reject());

        function callback(results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) {
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
      });
    }
  }

  public geolocation(): Promise<LatLngLiteral> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        this.toastService.show('Geolocation is not supported by your browser');
        return reject();
      }

      const failure = () => {
        this.toastService.show('Unable to retrieve your location');
        reject();
      };

      const success = (position: Position) => {
        resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
      };

      const options = {
        enableHighAccuracy: true,
        timeout: 15000
      };

      navigator.geolocation.getCurrentPosition(success, failure, options);
    });
  }
}
