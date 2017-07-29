import {
  Directive,
  OnChanges,
  Input,
  Renderer2,
  ElementRef
} from '@angular/core';

@Directive({
  selector: '[appFocus]'
})
export class FocusDirective implements OnChanges {
  @Input() appFocus: boolean;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    if (this.appFocus) {
      setTimeout(() => this.renderer.selectRootElement(this.elementRef.nativeElement).focus());
    }
  }
}
