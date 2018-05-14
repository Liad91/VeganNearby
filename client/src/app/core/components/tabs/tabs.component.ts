import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  QueryList,
  ViewChild
} from '@angular/core';

import { TabItemComponent } from './tab-item/tab-item.component';

@Component({
  selector: 'vn-tabs',
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent implements AfterViewInit, OnDestroy {
  @Input() selected: number;
  @ViewChild('tabs') tabs: ElementRef;
  @ContentChildren(TabItemComponent) tabItems: QueryList<TabItemComponent>;
  private $tabs: JQuery;
  public active: string;

  constructor(private zone: NgZone) { }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => this.initilaize());
  }

  private initilaize(): void {
    const selectedTab = this.tabItems.toArray()[this.selected];

    this.$tabs = $(this.tabs.nativeElement);
    this.$tabs.tabs();
    this.$tabs.tabs('select_tab', selectedTab.id);
    selectedTab.setActive(true);

    setTimeout(() => this.$tabs.tabs('select_tab', selectedTab.id), 0);
  }

  public setActive(i: number): void {
    this.tabItems.forEach((item, index) => index === i ? item.setActive(true) : item.setActive(false));
  }

  ngOnDestroy() {
    this.$tabs.remove();
  }
}
