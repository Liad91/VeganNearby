import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy
} from '@angular/core';

@Directive({
  selector: '[vnTooltip]'
})
export class TooltipDirective implements AfterViewInit, OnDestroy {
  @Input() tooltip: string;
  @Input() position = 'top';
  private $tooltip: JQuery;

  constructor(private elementRef: ElementRef, private zone: NgZone) { }

  ngAfterViewInit() {
    this.$tooltip = $(this.elementRef.nativeElement);
    this.zone.runOutsideAngular(() => this.initialize());
  }

  private initialize() {
    this.$tooltip.tooltip({
      delay: 350,
      tooltip: this.tooltip,
      position: this.position
    });
  }

  ngOnDestroy() {
    this.$tooltip.tooltip('remove');
  }
}
