import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vn-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})

export class PriceComponent implements OnInit {
  @Input() public price: string;
  @Input() public tooltip = false;
  private titles = ['Inexpensive', 'Moderate', 'Pricey', 'Ultra High-End'];
  public reminder = '$$$$';
  public title: string;

  ngOnInit() {
    if (this.price) {
      this.title = this.titles[this.price.length - 1];
      this.reminder = this.reminder.substr(this.price.length);
    }
  }
}
