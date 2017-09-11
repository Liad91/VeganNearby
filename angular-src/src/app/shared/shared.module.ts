import { NgModule, Directive } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterializeModule } from 'ng2-materialize';

import * as Directives from './directives';
import * as Pipes from './pipes';

@NgModule({
  declarations: [
    Directives.ColorDirective,
    Directives.BackgroundColorDirective,
    Directives.ActiveDirective,
    Directives.DropdownTriggerDirective,
    Directives.ImagePreviewDirective,
    Pipes.SearchFilterPipe
  ],
  imports: [
    CommonModule,
    MaterializeModule.forRoot()
  ],
  exports: [
    CommonModule,
    MaterializeModule,
    Directives.ColorDirective,
    Directives.BackgroundColorDirective,
    Directives.ActiveDirective,
    Directives.DropdownTriggerDirective,
    Directives.ImagePreviewDirective,
    Pipes.SearchFilterPipe
  ]
})
export class SharedModule { }
