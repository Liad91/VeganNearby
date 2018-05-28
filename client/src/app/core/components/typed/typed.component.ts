import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy
} from '@angular/core';

import * as Typed from 'typed.js';

@Component({
  selector: 'vn-typed',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypedComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() strings: string[];
  private typed: any;
  private initialized = false;

  constructor(private elementRef: ElementRef, private zone: NgZone) { }

  ngAfterViewInit(): void {
    this.typed = this.zone.runOutsideAngular(() => this.initilaize());
    this.initialized = true;
  }

  ngOnChanges(): void {
    if (this.initialized) {
      this.resetStrings();
    }
  }

  private initilaize(): any {
    return new Typed(this.elementRef.nativeElement, {
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

  ngOnDestroy(): void {
    this.typed.destroy();

    // Prevent memory leak
    clearTimeout(this.typed.timeout);
  }
}
