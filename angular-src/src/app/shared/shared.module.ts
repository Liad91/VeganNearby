import { NgModule, Directive } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterializeModule } from 'ng2-materialize';

import * as Components from './components';
import * as Directives from './directives';
import * as Pipes from './pipes';

@NgModule({
  declarations: [
    Components.AlertModalComponent,
    Components.BtnFavoriteComponent,
    Components.CarouselComponent,
    Components.CarouselItemComponent,
    Components.PlaceComponent,
    Components.PriceComponent,
    Components.StarsComponent,
    Components.TypedComponent,
    Components.TabsComponent,
    Components.TabItemComponent,
    Directives.ColorDirective,
    Directives.BackgroundColorDirective,
    Directives.ActiveDirective,
    Directives.SidenavButtonDirective,
    Directives.ImagePreviewDirective,
    Pipes.DayPipe,
    Pipes.HourPipe,
    Pipes.SearchFilterPipe
  ],
  entryComponents: [
    Components.AlertModalComponent
  ],
  imports: [
    CommonModule,
    MaterializeModule.forRoot()
  ],
  exports: [
    CommonModule,
    MaterializeModule,
    Components.AlertModalComponent,
    Components.BtnFavoriteComponent,
    Components.CarouselComponent,
    Components.CarouselItemComponent,
    Components.PlaceComponent,
    Components.PriceComponent,
    Components.StarsComponent,
    Components.TypedComponent,
    Components.TabsComponent,
    Components.TabItemComponent,
    Directives.ColorDirective,
    Directives.BackgroundColorDirective,
    Directives.ActiveDirective,
    Directives.SidenavButtonDirective,
    Directives.ImagePreviewDirective,
    Pipes.DayPipe,
    Pipes.HourPipe,
    Pipes.SearchFilterPipe
  ]
})
export class SharedModule { }
