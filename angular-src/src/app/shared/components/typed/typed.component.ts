import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges
} from '@angular/core';

import * as Typed from 'typed.js';

@Component({
  selector: 'vn-typed',
  template: '<ng-content></ng-content>'
})
export class TypedComponent implements AfterViewInit, OnChanges {
  @Input() strings: string[];
  private typed: Typed;
  private initialized = false;

  constructor(private elementRef: ElementRef, private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.initilaize();
    });
    this.initialized = true;
  }

  ngOnChanges(): void {
    if (this.initialized) {
      this.resetStrings();
    }
  }

  private initilaize(): void {
    this.typed = new Typed(this.elementRef.nativeElement, {
      strings: this.strings,
      typeSpeed: 80,
      backSpeed: 50,
      loop: true
    });
  }

  private resetStrings(): void {
    this.typed.strings = this.strings;
    this.typed.reset();
  }
}
