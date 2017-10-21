import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  Input,
  TemplateRef
} from '@angular/core';

@Component({
  selector: 'vn-tab-item',
  templateUrl: './tab-item.component.html'
})
export class TabItemComponent {
  @Input() id: string;
  @Input() label: string;
  @ContentChild(TemplateRef) template;
  public active = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public setActive(active: boolean): void {
    this.active = active;
    this.changeDetectorRef.detectChanges();
  }
}
