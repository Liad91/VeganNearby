import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  Input,
  TemplateRef
} from '@angular/core';

@Component({
  selector: 'vn-carousel-item',
  template: '<a class="carousel-item"><img [src]="src"></a>'
})
export class CarouselItemComponent {
  @Input() src: string;
  @Input() index: number;
}
