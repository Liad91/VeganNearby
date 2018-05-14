import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hour'
})
export class HourPipe implements PipeTransform {
  public transform(hour: string) {
    return `${hour.substr(0, 2)}:${hour.substr(2)}`;
  }
}
