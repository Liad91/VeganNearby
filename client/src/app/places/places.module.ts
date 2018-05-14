import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

// Components
import * as Components from './components';
import { PlacesComponent } from './places.component';

// Guards
import { PlaceDetailGuard } from './components/place-detail/place-detail.guard';

// Pipes
import * as Pipes from './pipes';

// Modules
import { PlacesRoutesModule } from './places.routes.module';
import { SharedModule } from './../shared/shared.module';

// Store
import { effects } from './store/places.effects';
import { placeDetailReducer } from './components/place-detail/store/place-detail.reducer';
import { placeListReducer } from './components/place-list/store/place-list.reducer';

@NgModule({
  declarations: [
    Components.FiltersComponent,
    Components.PaginationComponent,
    Components.PlaceDetailComponent,
    Components.PlaceListComponent,
    Pipes.DayPipe,
    Pipes.HourPipe,
    PlacesComponent
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
    PlaceDetailGuard
  ]
})
export class PlacesModule { }
