import { Pipe, PipeTransform } from '@angular/core';

import { Filter } from './../../models/filter.model';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  public transform(array: Filter[], key: string) {
    return array.filter(value => value.title.toLocaleLowerCase().includes(key.toLocaleLowerCase()));
  }
}
