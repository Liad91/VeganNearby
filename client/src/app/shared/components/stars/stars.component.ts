import { Component, Input } from '@angular/core';

@Component({
  selector: 'vn-stars',
  template: '<img class="w-100" src="assets/icons/stars/{{ rating }}.png">'
})
export class StarsComponent {
  @Input() rating: 0 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;
}
