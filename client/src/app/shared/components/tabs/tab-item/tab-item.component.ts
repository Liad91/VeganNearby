import { ChangeDetectorRef, Component, ContentChild, Input, NgZone, TemplateRef } from '@angular/core';

@Component({
  selector: 'vn-tab-item',
  templateUrl: './tab-item.component.html'
})
export class TabItemComponent {
  @Input() id: string;
  @Input() label: string;
  @ContentChild(TemplateRef) template;
  public active = false;

  constructor(private changeDetectorRef: ChangeDetectorRef, private zone: NgZone) {}

  public setActive(active: boolean): void {
    this.active = active;
    this.zone.run(() => {
      this.changeDetectorRef.detectChanges();
    });
  }
}
