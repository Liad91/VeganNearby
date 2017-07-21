import { Component, OnInit, ViewChild, ElementRef, EventEmitter, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';

import { YelpService } from './../../services/yelp.service';
import { YelpResponse } from './../../models/yelp.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  outputs: ['search', 'category' ],
  inputs: ['selected'],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit {
  public selected;
  public selectedCategory;
  public search = new EventEmitter();
  public category = new EventEmitter();
  @ViewChild("search")
  public searchElementRef: ElementRef;
  @ViewChild("form")
  public form: NgForm;

  public categoryOptions = [ 
    { title: 'Restaurants', alias: 'restaurants' },
    { title: 'Cafes', alias: 'cafes' },
    { title: 'Bars', alias: 'bars' }
  ];

  constructor(private mapsApiLoader: MapsAPILoader) { }

  ngOnInit() {
    this.buildLocationAutocomplete();
    this.setCategory();
  }

  private setCategory() {
    this.selectedCategory = this.categoryOptions.findIndex(category => category.alias === this.selected);
  }
  
  private buildLocationAutocomplete() {
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

  onChange() {
    const index = +this.form.controls.category.value;

    this.category.next(this.categoryOptions[index]);
  }

  onSubmit() {
    const location = this.form.controls.location.value;
    

    this.search.next({ location })
  }

}
