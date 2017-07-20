import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterializeModule } from 'ng2-materialize';
// TODO: Remove after ng2-materialize implemention is done
import { MdToolbarModule, MdIconModule, MdButtonModule, MdMenuModule, MdDialogModule, MdInputModule, MdProgressSpinnerModule, MdCardModule, MdTabsModule } from '@angular/material';

import { ColorDirective } from './color/color.directive';
import { BackgroundColorDirective } from './background-color/background-color.directive';
import { FocusDirective } from './focus/focus.directive';

@NgModule({
  declarations: [
    ColorDirective,
    BackgroundColorDirective,
    FocusDirective
  ],
  imports: [
    CommonModule,
    MaterializeModule.forRoot(),
    FlexLayoutModule,
    // TODO: Remove after ng2-materialize implemention is done
    MdToolbarModule,
    MdIconModule,
    MdButtonModule,
    MdMenuModule,
    MdDialogModule,
    MdInputModule,
    MdProgressSpinnerModule,
    MdCardModule,
    MdTabsModule,
    // END TODO
  ],
  exports: [
    CommonModule,
    MaterializeModule,
    FlexLayoutModule,
    // TODO: Remove after ng2-materialize implemention is done
    MdToolbarModule,
    MdIconModule,
    MdButtonModule,
    MdMenuModule,
    MdDialogModule,
    MdInputModule,
    MdProgressSpinnerModule,
    MdCardModule,
    MdTabsModule,
    // END TODO
    ColorDirective,
    BackgroundColorDirective,
    FocusDirective
  ],
})
export class SharedModule { }