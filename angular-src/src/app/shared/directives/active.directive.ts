import {
  Directive,
  OnChanges,
  Input,
  Renderer2,
  ElementRef
} from '@angular/core';

@Directive({
  selector: '[vnActive]'
})
export class ActiveDirective implements OnChanges {
  @Input() private vnActive: boolean;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    if (this.vnActive) {
      setTimeout(() => this.renderer.addClass(this.elementRef.nativeElement.nextElementSibling, 'active'));
    }
    else {
      setTimeout(() => this.renderer.removeClass(this.elementRef.nativeElement.nextElementSibling, 'active'));
    }
  }
}
