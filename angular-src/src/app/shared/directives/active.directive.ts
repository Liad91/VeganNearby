import {
  Directive,
  OnChanges,
  Input,
  Renderer2,
  ElementRef
} from '@angular/core';

@Directive({
  selector: '[appActive]'
})
export class ActiveDirective implements OnChanges {
  @Input() appActive: boolean;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    if (this.appActive) {
      setTimeout(() => this.renderer.addClass(this.elementRef.nativeElement.nextElementSibling, 'active'));
    }
    else {
      setTimeout(() => this.renderer.removeClass(this.elementRef.nativeElement.nextElementSibling, 'active'));
    }
  }
}
