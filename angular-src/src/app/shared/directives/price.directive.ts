import {
  Directive,
  AfterViewInit,
  Input,
  ElementRef,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[appPrice]'
})
export class PriceDirective implements AfterViewInit {
  @Input() private appPrice: string;
  private price = '$$$$';
  private titles = ['Inexpensive', 'Moderate', 'Pricey', 'Ultra High-End'];

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    if (this.appPrice) {
      const highlight = this.renderer.createElement('span');
      const remainder = this.renderer.createElement('span');

      highlight.innerHTML = this.appPrice;
      remainder.innerHTML = this.price.substr(this.appPrice.length);

      this.renderer.setStyle(highlight, 'color', '#41a700');
      this.renderer.setStyle(remainder, 'color', '#999');

      this.elementRef.nativeElement.innerHTML = `${this.titles[this.appPrice.length - 1]} `;
      this.renderer.appendChild(this.elementRef.nativeElement, highlight);
      this.renderer.appendChild(this.elementRef.nativeElement, remainder);
    }
    else {
      this.elementRef.nativeElement.innerHTML = 'Not available';
      this.renderer.setStyle(this.elementRef.nativeElement, 'color', '#999');
    }
  }
}
