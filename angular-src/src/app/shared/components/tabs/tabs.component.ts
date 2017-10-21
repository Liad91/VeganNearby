import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  NgZone,
  QueryList,
  ViewChild,
} from '@angular/core';

import { TabItemComponent } from './tab-item/tab-item.component';

@Component({
  selector: 'vn-tabs',
  templateUrl: './tabs.component.html'
})
export class TabsComponent implements AfterViewInit {
  @ViewChild('tabs') tabs: ElementRef;
  @ContentChildren(TabItemComponent) tabItems: QueryList<TabItemComponent>;
  private $tabs: JQuery;
  public active: string;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.initilaize();
    });
  }

  private initilaize(): void {
    this.$tabs = $(this.tabs.nativeElement);
    this.$tabs.tabs();
    this.$tabs.tabs('select_tab', this.tabItems.first.id);
    this.tabItems.first.setActive(true);
  }

  private setActive(i: number): void {
    this.tabItems.forEach((item, index) => index === i ? item.setActive(true) : item.setActive(false));
  }
}
