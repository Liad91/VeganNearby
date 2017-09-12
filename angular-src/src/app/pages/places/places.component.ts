import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ResizeService } from './../../services/rezise.service';
import { PlacesService } from './places.service';
import { YelpFilter } from './../../models/yelp.model';

@Component({
  selector: 'vn-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit, OnDestroy {
  public mobileView: boolean;
  public selectedLocation: string;
  public selectedCategory: YelpFilter;
  private resizeSubscription: Subscription;
  private locationSubscription: Subscription;

  constructor(private resizeService: ResizeService, private placesService: PlacesService) {}

  ngOnInit(): void {
    this.selectedCategory = this.placesService.selectedCategory;

    this.resizeSubscription = this.resizeService.screenSize.subscribe(
      size => this.mobileView = size === 'xs' || size === 'sm'
    );

    this.locationSubscription = this.placesService.selectedLocation.subscribe(
      location => this.selectedLocation = location
    )
  }

  public getRandomHeaderImage() {
    return Math.floor((Math.random() * 4) + 1);
  }

  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
    this.locationSubscription.unsubscribe();
  }
}
