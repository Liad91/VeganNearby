import { Subscription } from 'rxjs/Subscription';
import { PlacesService } from './places.service';
import { Component, OnInit } from '@angular/core';
import { LatLngLiteral, MapsAPILoader } from '@agm/core';

import { YelpSearchResponse } from '../../models/yelp.model';
import { ToastService } from './../../services/toast.service';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {
  public data: YelpSearchResponse
  public location: string;
  public category: string;
  public mapCenter: LatLngLiteral;
  private updateSubscription: Subscription;
  public currentPage = 1;
  public itemsPerPage = 20;

  constructor(private placesService: PlacesService, private toastService: ToastService) { }

  ngOnInit() {
    this.data = this.placesService.data;
    this.location = this.placesService.location;
    this.category = this.placesService.category;
    this.mapCenter = {
      lat: this.data.region.center.latitude,
      lng: this.data.region.center.longitude
    }
    console.log(this.data.businesses);
  }

  public onCenterChange(event: LatLngLiteral): void {
    this.mapCenter = event;
  }

  private updatePlaces(location: string) {
    if (this.updateSubscription && !this.updateSubscription.closed) {
      this.updateSubscription.unsubscribe();
    }
    this.updateSubscription = this.placesService.search(location, this.category)
      .subscribe(
        response => this.updatePlacesSuccess(response)
      )
  }

  private updatePlacesSuccess(response) {
    if (response.error) {
      this.toastService.show(response.error.description);
      return;
    }
    this.location = this.placesService.location;
  }

  public checkForChanges() {
    const currentPosition = this.data.region.center;

    if (this.mapCenter.lat !== currentPosition.latitude || this.mapCenter.lng !== currentPosition.longitude) {
      this.placesService.geocoder(this.mapCenter.lat, this.mapCenter.lng)
        .then((location: string) => {
          if (this.location !== location) {
            this.updatePlaces(location);
          }
        })
        .catch(this.geoError.bind(this));
    }
  }

  private geoError(): void {
    this.toastService.show('Unable to get the location');
  }
}
