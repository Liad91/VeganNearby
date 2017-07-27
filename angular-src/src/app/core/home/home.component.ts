import { Component, OnInit } from '@angular/core';
import * as Typed from 'typed.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  query: string;
  category = { title: 'Bars', alias: 'bars' };
  typed: Typed;

  ngOnInit() {
    this.setTyped();
  }

  onCategoryChanged(category) {
    if (this.category.alias !== category.alias) {
      this.category = category;
      this.resetTyped();
    }
  }
  
  private setTyped() {
    let strings;

    switch(this.category.alias) {
      case 'restaurants':
        strings = [`Find the best ${this.category.alias}^1000`, `Find the most rated ${this.category.alias}^1000`, `Find your favorite ${this.category.alias}^1000`];
        break;
      case 'cafes':
        strings = [`Find ${this.category.alias} with the most richest breakfast^1000`, `Find ${this.category.alias} with wifi^1000`, `Find your perfect ${this.category.alias}^1000`];
        break;
      case 'bars':
        strings = [`Find the most popular ${this.category.alias}^1000`, `Find ${this.category.alias} with the best liquors^1000`, `Find the most crowded ${this.category.alias}^1000`];
    }
    this.typed = new Typed('#typing', {
      strings: strings,
      typeSpeed: 80,
      backSpeed: 50,
      loop: true
    });
  }

  private resetTyped() {
    this.typed.destroy();
    this.setTyped();
  }
}
