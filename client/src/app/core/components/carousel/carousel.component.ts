import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'vn-carousel',
  templateUrl: './carousel.component.html'
})
export class CarouselComponent implements AfterViewInit, OnDestroy {
  @Input() options: OwlCarousel.Options = {};
  @ViewChild('carousel') carousel: ElementRef;
  private $carousel: JQuery;

  constructor(private zone: NgZone) { }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => this.initilaize());
  }

  private initilaize(): void {
    this.$carousel = $(this.carousel.nativeElement);
    this.$carousel.owlCarousel(this.options);
  }

  ngOnDestroy() {
    this.$carousel.owlCarousel('destroy');
  }
}
