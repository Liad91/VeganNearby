import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// Components
import { PlaceComponent } from './place/place.component';
import { StarsComponent } from './place/stars/stars.component';
import { PlacesComponent } from './places.component';
import { PlaceListComponent } from './place-list/place-list.component';
import { PriceComponent } from './place/price/price.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { FiltersComponent } from './filters/filters.component';
import { CuisinesComponent } from './filters/cuisines/cuisines.component';
import { PaginationComponent } from './pagination/pagination.component';

// Guards
import { PlaceListGuard } from './place-list/place-list.guard';
import { FavoritesGuard } from './favorites/favorites.guard';

// Modules
import { PlacesRoutesModule } from './places.routes.module';
import { SharedModule } from './../shared/shared.module';

// Store
import { placeListReducer } from './place-list/store/place-list.reducers';
import { effects } from './store/places.effects';

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
    SharedModule,
    StoreModule.forFeature('placeList', placeListReducer),
    EffectsModule.forFeature(effects)
  ],
  providers: [
    GoogleMapsAPIWrapper,
    PlaceListGuard,
    FavoritesGuard
  ]
})
export class PlacesModule { }
