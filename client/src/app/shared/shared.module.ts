import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MzButtonModule,
  MzInjectionModule,
  MzInputModule,
  MzModalModule,
  MzSelectModule,
  MzSpinnerModule,
  MzToastModule,
  MzValidationModule
} from 'ng2-materialize';

import * as Components from './components';

const materializeModules = [
  MzButtonModule,
  MzInjectionModule,
  MzInputModule,
  MzModalModule,
  MzSpinnerModule,
  MzToastModule,
  MzValidationModule
];

@NgModule({
  declarations: [
    Components.AlertModalComponent,
    Components.BtnFavoriteComponent,
    Components.PlaceComponent,
    Components.PriceComponent,
    Components.StarsComponent,
    Components.ErrorComponent,
    Components.LoaderComponent
  ],
  entryComponents: [
    Components.AlertModalComponent
  ],
  imports: [
    CommonModule,
    materializeModules,
  ],
  exports: [
    materializeModules,
    Components.AlertModalComponent,
    Components.BtnFavoriteComponent,
    Components.PlaceComponent,
    Components.PriceComponent,
    Components.StarsComponent,
    Components.ErrorComponent,
    Components.LoaderComponent
  ]
})
export class SharedModule { }
