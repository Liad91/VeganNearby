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
import { PlaceDetailComponent } from './place-detail/place-detail.component';
import { PriceComponent } from './place/price/price.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { FiltersComponent } from './filters/filters.component';
import { CuisinesModalComponent } from './filters/cuisines-modal/cuisines-modal.component';
import { PaginationComponent } from './pagination/pagination.component';

// Guards
import { PlaceListGuard } from './place-list/place-list.guard';
import { FavoritesGuard } from './favorites/favorites.guard';

// Modules
import { PlacesRoutesModule } from './places.routes.module';
import { SharedModule } from './../shared/shared.module';

// Store
import { effects } from './store/places.effects';
import { placeListReducer } from './place-list/store/place-list.reducers';
import { placeDetailReducer } from './place-detail/store/place-detail.reducers';

@NgModule({
  declarations: [
    StarsComponent,
    PlaceComponent,
    PlacesComponent,
    PlaceListComponent,
    PlaceDetailComponent,
    PriceComponent,
    FavoritesComponent,
    FiltersComponent,
    CuisinesModalComponent,
    PaginationComponent
  ],
  entryComponents: [
    CuisinesModalComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    AgmCoreModule,
    PlacesRoutesModule,
    SharedModule,
    StoreModule.forFeature('placeList', placeListReducer),
    StoreModule.forFeature('placeDetail', placeDetailReducer),
    EffectsModule.forFeature(effects)
  ],
  providers: [
    GoogleMapsAPIWrapper,
    PlaceListGuard,
    FavoritesGuard
  ]
})
export class PlacesModule { }
