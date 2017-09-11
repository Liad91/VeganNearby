import { Component, OnInit, Input } from '@angular/core';

import { YelpBusinessResponse } from '../../../../models/yelp.model';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss']
})
export class PlaceComponent implements OnInit {
  @Input() place: YelpBusinessResponse;

  constructor() {}

  ngOnInit() {
  }

}
