import { YelpSearchBusiness } from '../../../../models/yelp.model';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'vn-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss']
})
export class PlaceComponent implements OnInit, OnDestroy {
  @Input() public place: YelpSearchBusiness

  constructor() {}

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
