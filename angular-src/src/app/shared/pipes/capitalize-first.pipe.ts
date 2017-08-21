import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirst'
})
export class CapitalizeFirstPipe implements PipeTransform {
  transform(value: string, args: any[]): string {
    return value[0].toUpperCase() + value.substr(1);
  }
}
