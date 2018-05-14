import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Input,
  NgZone,
  TemplateRef
} from '@angular/core';

@Component({
  selector: 'vn-tab-item',
  templateUrl: './tab-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabItemComponent {
  @Input() id: string;
  @Input() label: string;
  @ContentChild(TemplateRef) template;
  public active = false;

  constructor(private cd: ChangeDetectorRef, private zone: NgZone) { }

  public setActive(active: boolean): void {
    this.active = active;
    this.zone.run(() => {
      this.cd.detectChanges();
    });
  }
}
