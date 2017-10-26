import { Component, Input } from '@angular/core';

import { YelpBusiness } from './../../models/yelp.model';

@Component({
  selector: 'vn-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss']
})
export class PlaceComponent {
  @Input() public place: YelpBusiness;

  constructor() {}
}
