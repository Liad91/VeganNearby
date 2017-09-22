import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';

// Components
import { PlaceComponent } from './places-list/place/place.component';
import { StarsComponent } from './places-list/place/stars/stars.component';
import { PlacesComponent } from './places.component';
import { PlacesListComponent } from './places-list/places-list.component';
import { PriceComponent } from './places-list/place/price/price.component';
import { FiltersComponent } from './places-list/filters/filters.component';
import { CuisinesComponent } from './places-list/filters/cuisines/cuisines.component';
import { PaginationComponent } from './pagination/pagination.component';

// Modules
import { PlacesRoutesModule } from './places.routes.module';
import { ComponentsModule } from '../../components/components.module';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    StarsComponent,
    PlaceComponent,
    PlacesComponent,
    PlacesListComponent,
    PriceComponent,
    FiltersComponent,
    CuisinesComponent,
    PaginationComponent
  ],
  entryComponents: [
    CuisinesComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    AgmCoreModule,
    PlacesRoutesModule,
    ComponentsModule,
    SharedModule
  ],
  providers: [
    GoogleMapsAPIWrapper
  ]
})
export class PlacesModule { }
