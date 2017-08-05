import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnInit
} from '@angular/core';

@Directive({
  selector: '[appColor]'
})
export class ColorDirective implements OnInit {
  @Input() appColor: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.addClass(this.elementRef.nativeElement, `color-${this.appColor}`);
  }
}
