import { animation } from '@angular/animations';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Typed from 'typed.js';

import { bgStateTrigger } from './animations';
import { YelpFilter } from './../../models/yelp.model';
import { PlacesService } from './../places/places.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [ bgStateTrigger ]
})
export class HomeComponent implements OnInit, OnDestroy {
  public selectedCategory: YelpFilter;
  private typed: Typed;

  constructor(private placesService: PlacesService) {}

  ngOnInit(): void {
    this.selectedCategory = this.placesService.selectedCategory;
    this.initializeTyped();
  }

  private initializeTyped(): void {
    let strings;

    switch (this.selectedCategory.alias) {
      case 'restaurants':
        strings = [
          `Find the best ${this.selectedCategory.alias}^1000`,
          `Find the most rated ${this.selectedCategory.alias}^1000`,
          `Find your favorite ${this.selectedCategory.alias}^1000`
        ];
        break;
      case 'cafes':
        strings = [
          `Find ${this.selectedCategory.alias} with the most richest breakfast^1000`,
          `Find ${this.selectedCategory.alias} with wifi^1000`,
          `Find your perfect ${this.selectedCategory.alias}^1000`
        ];
        break;
      case 'bars':
        strings = [
          `Find the most popular ${this.selectedCategory.alias}^1000`,
          `Find ${this.selectedCategory.alias} with the best liquors^1000`,
          `Find the most crowded ${this.selectedCategory.alias}^1000`
        ];
    }
    this.typed = new Typed('#typing', {
      strings,
      typeSpeed: 80,
      backSpeed: 50,
      loop: true
    });
  }

  public onCategoryChanged(): void {
    this.typed.destroy();
    this.initializeTyped();
  }

  ngOnDestroy(): void {
    this.typed.destroy();
  }
}
