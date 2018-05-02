import { FormsModule } from '@angular/forms';
import { NgModule, Directive } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import * as Directives from './directives';
import * as Pipes from './pipes';

const materializeModules = [
  MzButtonModule,
  MzInjectionModule,
  MzInputModule,
  MzModalModule,
  MzSelectModule,
  MzSpinnerModule,
  MzToastModule,
  MzValidationModule
];

@NgModule({
  declarations: [
    Components.AlertModalComponent,
    Components.BtnFavoriteComponent,
    Components.LightboxModalComponent,
    Components.PlaceComponent,
    Components.PriceComponent,
    Components.StarsComponent,
    Components.TypedComponent,
    Components.TabsComponent,
    Components.TabItemComponent,
    Components.CuisinesModalComponent,
    Components.ErrorComponent,
    Components.LoaderComponent,
    Directives.ColorDirective,
    Directives.BackgroundColorDirective,
    Directives.ImagePreviewDirective,
    Directives.SidenavButtonDirective,
    Directives.TooltipDirective,
    Pipes.DayPipe,
    Pipes.HourPipe,
    Pipes.SearchFilterPipe
  ],
  entryComponents: [
    Components.AlertModalComponent,
    Components.LightboxModalComponent,
    Components.CuisinesModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    materializeModules,
  ],
  exports: [
    CommonModule,
    FormsModule,
    materializeModules,
    Components.AlertModalComponent,
    Components.BtnFavoriteComponent,
    Components.LightboxModalComponent,
    Components.PlaceComponent,
    Components.PriceComponent,
    Components.StarsComponent,
    Components.TypedComponent,
    Components.TabsComponent,
    Components.TabItemComponent,
    Components.ErrorComponent,
    Components.LoaderComponent,
    Directives.BackgroundColorDirective,
    Directives.ColorDirective,
    Directives.ImagePreviewDirective,
    Directives.SidenavButtonDirective,
    Directives.TooltipDirective,
    Pipes.DayPipe,
    Pipes.HourPipe,
    Pipes.SearchFilterPipe
  ]
})
export class SharedModule { }
