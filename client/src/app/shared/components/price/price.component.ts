import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'vn-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PriceComponent implements OnInit {
  @Input() public price;
  @Input() public textOnly = false;
  private titles = ['Inexpensive', 'Moderate', 'Pricey', 'Ultra High-End'];
  public reminder = '$$$$';
  public title: string;

  ngOnInit() {
    if (this.price) {
      // Fix different currencies bug
      // https://github.com/Yelp/yelp-fusion/issues/407
      this.price = '$'.repeat(this.price.length);

      this.title = this.titles[this.price.length - 1];
      this.reminder = this.reminder.substr(this.price.length);
    }
    else {
      this.title = 'Unknown';
    }
  }
}
