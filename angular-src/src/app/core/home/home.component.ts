import { Component, OnInit } from '@angular/core';
import * as Typed from 'typed.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public category = { title: 'Bars', alias: 'bars' };
  private typed: Typed;

  ngOnInit(): void {
    this.initializeTyped();
  }

  private initializeTyped(): void {
    let strings;

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
    if (this.category.alias !== category.alias) {
      this.category = category;
      this.resetTyped();
    }
  }
}
