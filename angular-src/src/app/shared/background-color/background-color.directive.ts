import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[bgColor]'
})
export class BackgroundColorDirective implements OnInit{
  @Input() bgColor: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.addClass(this.elementRef.nativeElement, `bg-color-${this.bgColor}`);
  }
}