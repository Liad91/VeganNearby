import { animation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import * as Typed from 'typed.js';

import { bgStateTrigger } from './animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [ bgStateTrigger ]
})
export class HomeComponent implements OnInit {
  public category = 'restaurants';
  private typed: Typed;

  ngOnInit(): void {
    this.initializeTyped();
  }

  private initializeTyped(): void {
    let strings;

    switch (this.category) {
      case 'restaurants':
        strings = [
          `Find the best ${this.category}^1000`,
          `Find the most rated ${this.category}^1000`,
          `Find your favorite ${this.category}^1000`
        ];
        break;
      case 'cafes':
        strings = [
          `Find ${this.category} with the most richest breakfast^1000`,
          `Find ${this.category} with wifi^1000`,
          `Find your perfect ${this.category}^1000`
        ];
        break;
      case 'bars':
        strings = [
          `Find the most popular ${this.category}^1000`,
          `Find ${this.category} with the best liquors^1000`,
          `Find the most crowded ${this.category}^1000`
        ];
    }
    this.typed = new Typed('#typing', {
      strings: strings,
      typeSpeed: 80,
      backSpeed: 50,
      loop: true
    });
  }

  private resetTyped(): void {
    this.typed.destroy();
    this.initializeTyped();
  }

  public onCategoryChanged(category): void {
    if (this.category !== category) {
      this.category = category;
      this.resetTyped();
    }
  }
}
