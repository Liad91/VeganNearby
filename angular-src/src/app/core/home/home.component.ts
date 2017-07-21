import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import * as Typed from 'typed.js';

import { NavigationService } from './../../services/navigation.service';
import { YelpService } from './../../services/yelp.service';
import { YelpResponse } from './../../models/yelp.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild("search") searchElementRef: ElementRef;
  @ViewChild("form") form: NgForm;
  query: string;
  page: string;
  typed: Typed;

  constructor(private navigationService: NavigationService,
              private mapsApiLoader: MapsAPILoader,
              private yelpService: YelpService) { }

  ngOnInit() {
    this.page = this.navigationService.currentPage;
    this.navigationService.navigator.subscribe(
      page => {
        if (this.page !== page) {
          this.page = page;
          this.resetTyped();
        }
      }
    );
    this.setTyped();
    this.initializeAutocomplete();
  }

  private initializeAutocomplete() {
    this.mapsApiLoader.load()
      .then(() => {
        const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ['(cities)']
        });

        autocomplete.addListener('place_changed', () => {
          this.form.setValue({location: autocomplete.getPlace().formatted_address});
        });
      });
  }
  
  private displayBusinesses(data: YelpResponse) {
    console.log(data);
  }

  onSubmit() {
    const term = `${this.page}s`;
    const location = this.form.controls.location.value;

    this.yelpService.search(location, term)
      .subscribe(this.displayBusinesses);
  }

  private setTyped() {
    let strings;

    switch(this.page) {
      case 'restaurant':
        strings = [`Find the best ${this.page}^1000`, `Find the most rated ${this.page}^1000`, `Find your favorite ${this.page}^1000`];
        break;
      case 'cafe':
        strings = [`Find ${this.page} with the most richest breakfast^1000`, `Find ${this.page} with wifi^1000`, `Find your perfect ${this.page}^1000`];
        break;
      case 'bar':
        strings = [`Find the most popular ${this.page}^1000`, `Find ${this.page} with the best liquors^1000`, `Find the most crowded ${this.page}^1000`];
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

  ngOnDestroy() {
    this.navigationService.navigator.unsubscribe();
  }
}
