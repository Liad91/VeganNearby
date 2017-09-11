import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

// Components
import { BusinessComponent } from './places-list/business/business.component';
import { StarsComponent } from './places-list/business/stars/stars.component';
import { PlacesComponent } from './places.component';
import { PlacesListComponent } from './places-list/places-list.component';
import { PlaceComponent } from './places-list/place/place.component';
import { PriceComponent } from './places-list/business/price/price.component';
import { FiltersComponent } from './places-list/filters/filters.component';
import { CuisinesComponent } from './places-list/filters/cuisines/cuisines.component';
import { PaginationComponent } from './pagination/pagination.component';


// Services
import { ResizeService } from './../../services/rezise.service';

// Modules
import { PlacesRoutesModule } from './places.routes.module';
import { ComponentsModule } from '../../components/components.module';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    BusinessComponent,
    StarsComponent,
    PlacesComponent,
    PlacesListComponent,
    PlaceComponent,
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
    ResizeService
  ]
})
export class PlacesModule { }
