import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'day'
})
export class DayPipe implements PipeTransform {
  public transform(day: number) {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thurstday', 'Friday', 'Saturday'][day];
  }
}
