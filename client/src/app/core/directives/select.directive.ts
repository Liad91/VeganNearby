import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  NgZone,
  OnDestroy,
  Output
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Directive({
  selector: 'select[vnSelect]'
})
export class SelectDirective implements AfterViewInit, OnDestroy {
  @Output() update: EventEmitter<string> = new EventEmitter();
  private changeSubscription: Subscription;
  private $select: JQuery;

  constructor(private elementRef: ElementRef, private zone: NgZone) { }

  ngAfterViewInit() {
    this.$select = $(this.elementRef.nativeElement);
    this.zone.runOutsideAngular(() => this.initialize());
  }

  private initialize() {
    this.$select.material_select();
    this.changeSubscription = fromEvent(this.$select, 'change').subscribe(
      (event: any) => this.zone.run(() => this.update.emit(event.target.value))
    );
  }

  ngOnDestroy() {
    this.$select.material_select('destroy');
    this.changeSubscription.unsubscribe();
  }
}
