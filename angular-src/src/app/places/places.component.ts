import { PlacesService } from './places.service';
import { Component, OnInit } from '@angular/core';

import { YelpResponse } from './../models/yelp.model';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {
  data: YelpResponse

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.data = this.placesService.data;
  }
}
