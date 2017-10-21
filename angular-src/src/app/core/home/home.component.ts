import { Component, OnInit, OnDestroy } from '@angular/core';
import { animation } from '@angular/animations';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { bgStateTrigger } from './animations';
import * as fromRoot from '../../store/app.reducers';
import { Filter } from '../../places/filters/store/filters.reducers';


@Component({
  selector: 'vn-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [ bgStateTrigger ]
})
export class HomeComponent implements OnInit, OnDestroy {
  private categorySubscription: Subscription;
  public category: Filter;
  public strings: string[];

  constructor(private store: Store<fromRoot.AppState>) {}

  ngOnInit(): void {
    this.categorySubscription = this.store.select(fromRoot.selectSearchCategory).subscribe(
      category => {
        this.category = category;
        this.setStrings();
      }
    );
  }

  private setStrings() {
    switch (this.category.alias) {
      case 'restaurants':
        this.strings = [
          `Find the best ${this.category.alias}^1000`,
          `Find the most rated ${this.category.alias}^1000`,
          `Find your favorite ${this.category.alias}^1000`
        ];
        break;
      case 'cafes':
        this.strings = [
          `Find ${this.category.alias} with the most richest breakfast^1000`,
          `Find ${this.category.alias} with wifi^1000`,
          `Find your perfect ${this.category.alias}^1000`
        ];
        break;
      case 'bars':
        this.strings = [
          `Find the most popular ${this.category.alias}^1000`,
          `Find ${this.category.alias} with the best liquors^1000`,
          `Find the most crowded ${this.category.alias}^1000`
        ];
    }
  }

  ngOnDestroy(): void {
    this.categorySubscription.unsubscribe();
  }
}
