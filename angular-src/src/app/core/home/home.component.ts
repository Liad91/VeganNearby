import { Component, OnInit, OnDestroy } from '@angular/core';
import { animation } from '@angular/animations';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import * as Typed from 'typed.js';

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
  private typed: Typed;

  constructor(private store: Store<fromRoot.AppState>) {}

  ngOnInit(): void {
    this.categorySubscription = this.store.select(fromRoot.selectSearchCategory).subscribe(
      category => {
        this.category = category;
        this.setTyped();
      }
    );
  }

  private setTyped(): void {
    let strings;

    if (this.typed) {
      this.typed.destroy();
    }

    switch (this.category.alias) {
      case 'restaurants':
        strings = [
          `Find the best ${this.category.alias}^1000`,
          `Find the most rated ${this.category.alias}^1000`,
          `Find your favorite ${this.category.alias}^1000`
        ];
        break;
      case 'cafes':
        strings = [
          `Find ${this.category.alias} with the most richest breakfast^1000`,
          `Find ${this.category.alias} with wifi^1000`,
          `Find your perfect ${this.category.alias}^1000`
        ];
        break;
      case 'bars':
        strings = [
          `Find the most popular ${this.category.alias}^1000`,
          `Find ${this.category.alias} with the best liquors^1000`,
          `Find the most crowded ${this.category.alias}^1000`
        ];
    }
    this.typed = new Typed('#typing', {
      strings,
      typeSpeed: 80,
      backSpeed: 50,
      loop: true
    });
  }

  ngOnDestroy(): void {
    this.typed.destroy();
    this.categorySubscription.unsubscribe();
  }
}
