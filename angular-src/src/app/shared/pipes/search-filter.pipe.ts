import {Pipe, PipeTransform} from '@angular/core';

import { YelpFilter } from './../../models/yelp.model';

@Pipe({
	name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
	public transform(array: YelpFilter[], key: string) {

		return array.filter(value => value.title.toLocaleLowerCase().includes(key.toLocaleLowerCase()));
	}
}
