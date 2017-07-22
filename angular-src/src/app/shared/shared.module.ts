import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterializeModule } from 'ng2-materialize';

import { ColorDirective } from './color/color.directive';
import { BackgroundColorDirective } from './background-color/background-color.directive';
import { FocusDirective } from './focus/focus.directive';
import { SearchComponent } from './search/search.component';
import { NavComponent } from './nav/nav.component';
import { RegistrationComponent } from './nav/registration/registration.component';

@NgModule({
  declarations: [
    ColorDirective,
    BackgroundColorDirective,
    FocusDirective,
    SearchComponent,
    NavComponent,
    RegistrationComponent
  ],
  entryComponents: [
    RegistrationComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MaterializeModule.forRoot(),
    FlexLayoutModule
  ],
  exports: [
    CommonModule,
    MaterializeModule,
    FlexLayoutModule,
    ColorDirective,
    BackgroundColorDirective,
    FocusDirective,
    SearchComponent,
    NavComponent
  ],
})
export class SharedModule { }