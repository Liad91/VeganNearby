import {Pipe, PipeTransform} from '@angular/core';

import { Filter } from '../../places/filters/store/filters.reducers';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  public transform(array: Filter[], key: string) {
    return array.filter(value => value.title.toLocaleLowerCase().includes(key.toLocaleLowerCase()));
  }
}
