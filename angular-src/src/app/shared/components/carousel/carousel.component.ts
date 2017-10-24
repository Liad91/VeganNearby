import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'vn-carousel',
  templateUrl: './carousel.component.html'
})
export class CarouselComponent implements AfterViewInit, OnDestroy {
  @ViewChild('carousel') carousel: ElementRef;
  @Input() class: string;
  @Input() duration = 200;
  @Input() noWrap = false;
  @Input() fullWidth = false;
  @Input() indicators = false;

  private $carousel: JQuery;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.$carousel = $(this.carousel.nativeElement);
    this.zone.runOutsideAngular(() => this.initilaize());
  }

  private initilaize(): void {
    this.$carousel.carousel({
      duration: this.duration,
      noWrap: this.noWrap,
      fullWidth: this.fullWidth,
      indicators: this.indicators
    });
  }

  ngOnDestroy() {
    this.$carousel.carousel('destroy');
  }
}
