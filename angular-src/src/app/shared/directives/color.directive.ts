import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnInit
} from '@angular/core';

@Directive({
  selector: '[vnColor]'
})
export class ColorDirective implements OnInit {
  @Input() private vnColor: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.addClass(this.elementRef.nativeElement, `color-${this.vnColor}`);
  }
}
