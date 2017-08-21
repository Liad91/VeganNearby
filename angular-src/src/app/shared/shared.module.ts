import { NgModule, Directive } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
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
    Pipes.CapitalizeFirstPipe
  ],
  imports: [
    CommonModule,
    MaterializeModule.forRoot(),
    FlexLayoutModule
  ],
  exports: [
    CommonModule,
    MaterializeModule,
    FlexLayoutModule,
    Directives.ColorDirective,
    Directives.BackgroundColorDirective,
    Directives.ActiveDirective,
    Directives.DropdownTriggerDirective,
    Directives.ImagePreviewDirective,
    Pipes.CapitalizeFirstPipe
  ],
})
export class SharedModule { }
