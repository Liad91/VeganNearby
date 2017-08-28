import { YelpSearchBusiness } from './../../models/yelp.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-business',
	templateUrl: './business.component.html',
	styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit {
	@Input() public business: YelpSearchBusiness

	constructor() {}

	ngOnInit() {
	}
}
