import { NgModule, Directive } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterializeModule } from 'ng2-materialize';

import * as Directives from './directives';


@NgModule({
  declarations: [
    Directives.ColorDirective,
    Directives.BackgroundColorDirective,
    Directives.FocusDirective,
    Directives.DropdownTrigger
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
    Directives.FocusDirective,
    Directives.DropdownTrigger
  ],
})
export class SharedModule { }