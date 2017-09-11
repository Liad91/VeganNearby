import { YelpSearchBusiness } from '../../../../models/yelp.model';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit, OnDestroy {
  @Input() public business: YelpSearchBusiness

  constructor() {}

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
