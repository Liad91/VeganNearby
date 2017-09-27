import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';

// Components
import { PlaceComponent } from './place-list/place/place.component';
import { StarsComponent } from './place-list/place/stars/stars.component';
import { PlacesComponent } from './places.component';
import { PlaceListComponent } from './place-list/place-list.component';
import { PriceComponent } from './place-list/place/price/price.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { FiltersComponent } from './place-list/filters/filters.component';
import { CuisinesComponent } from './place-list/filters/cuisines/cuisines.component';
import { PaginationComponent } from './pagination/pagination.component';

// Guards
import { PlaceListGuard } from './place-list/place-list.guard';
import { FavoritesGuard } from './favorites/favorites.guard';

// Modules
import { PlacesRoutesModule } from './places.routes.module';
import { SharedModule } from './../shared/shared.module';


@NgModule({
  declarations: [
    StarsComponent,
    PlaceComponent,
    PlacesComponent,
    PlaceListComponent,
    PriceComponent,
    FavoritesComponent,
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
    SharedModule
  ],
  providers: [
    GoogleMapsAPIWrapper,
    PlaceListGuard,
    FavoritesGuard
  ]
})
export class PlacesModule { }
