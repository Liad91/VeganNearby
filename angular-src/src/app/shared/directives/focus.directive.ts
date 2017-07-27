import { Directive, OnChanges, Input, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[focus]'
})
export class FocusDirective implements OnChanges {
  @Input() focus: boolean;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    if (this.focus) {
      setTimeout(() => this.renderer.selectRootElement(this.elementRef.nativeElement).focus());
    }
  }
}