import { NgModule, Directive } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterializeModule } from 'ng2-materialize';

import * as Components from './components';
import * as Directives from './directives';
import * as Pipes from './pipes';

@NgModule({
  declarations: [
    Components.AlertModalComponent,
    Components.TypedComponent,
    Components.TabsComponent,
    Components.TabItemComponent,
    Directives.ColorDirective,
    Directives.BackgroundColorDirective,
    Directives.ActiveDirective,
    Directives.DropdownTriggerDirective,
    Directives.ImagePreviewDirective,
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
    Components.TypedComponent,
    Components.TabsComponent,
    Components.TabItemComponent,
    Directives.ColorDirective,
    Directives.BackgroundColorDirective,
    Directives.ActiveDirective,
    Directives.DropdownTriggerDirective,
    Directives.ImagePreviewDirective,
    Pipes.SearchFilterPipe
  ]
})
export class SharedModule { }
