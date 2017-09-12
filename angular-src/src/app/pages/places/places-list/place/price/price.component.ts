import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vn-price',
  template: `
    <ng-container *ngIf="price">
      <span>{{ title }}
        <span style="color: #41a700">{{ price }}</span><span style="color: #999">{{ reminder }}</span>
      </span>
    </ng-container>
    <ng-container *ngIf="!price">
      <span style="color: #999">Not available</span>
    </ng-container>
  `
})

export class PriceComponent implements OnInit {
  @Input() public price: string;
  private titles = ['Inexpensive', 'Moderate', 'Pricey', 'Ultra High-End'];
  public reminder = '$$$$';
  public title: string;

  ngOnInit() {
    if (this.price) {
      this.title = this.titles[this.price.length];
      this.reminder = this.reminder.substr(this.price.length);
    }
  }
}
