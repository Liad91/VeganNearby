import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[vnSidenavButton]'
})
export class SidenavButtonDirective implements AfterViewInit, OnDestroy {
  @Input() sidenav: string;
  @Input() width = 300;
  @Input() edge = 'left';
  @Input() draggable = true;
  @Input() closeOnClick = true;
  @Output() isOpen: EventEmitter<boolean> = new EventEmitter();
  private $button: JQuery;

  constructor(private elementRef: ElementRef, private renderer: Renderer2, private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.setAttribute();
    this.zone.runOutsideAngular(() => this.initialize());
  }

  private initialize(): void {
    this.$button = $(this.elementRef.nativeElement);
    this.$button.sideNav(<any>{
      edge: this.edge,
      menuWidth: this.width,
      draggable: this.draggable,
      closeOnClick: this.closeOnClick,
      onOpen: () => this.zone.run(() => this.isOpen.emit(true)),
      onClose: () => this.zone.run(() => this.isOpen.emit(false))
    });
  }

  private setAttribute(): void {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'data-activates', this.sidenav);
  }

  public hide(): void {
    this.$button.sideNav('hide');
  }

  public show(): void {
    this.$button.sideNav('show');
  }

  ngOnDestroy(): void {
    this.$button.sideNav('destroy');
  }
}
