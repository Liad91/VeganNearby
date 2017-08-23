import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';

import { PlacesRoutesModule } from './places.routes.module';
import { PlacesComponent } from './places.component';
import { ComponentsModule } from '../../components/components.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    PlacesComponent
  ],
  entryComponents: [],
  imports: [
    PlacesRoutesModule,
    CommonModule,
    AgmCoreModule,
    ComponentsModule,
    SharedModule
  ]
})
export class PlacesModule { }
