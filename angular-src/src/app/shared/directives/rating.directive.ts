import {
  Directive,
  AfterViewInit,
  Input,
  ElementRef,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[appRating]'
})
export class RatingDirective implements AfterViewInit {
  @Input() private appRating: 0 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;
  @Input() private size: 'sm' | 'md' | 'lg' | 'xl';

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    if (!this.size) {
      this.size = 'md';
    }
    console.log(this.size);
    const img = this.renderer.createElement('img');

    this.renderer.setAttribute(img, 'src', `assets/icons/stars/${this.size}/${this.appRating}.png`);
    this.renderer.appendChild(this.elementRef.nativeElement, img);
  }
}
