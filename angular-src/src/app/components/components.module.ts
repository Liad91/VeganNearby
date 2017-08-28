import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileDropDirective, FileSelectDirective } from 'ng2-file-upload';

import { BusinessComponent } from './business/business.component';
import { NavComponent } from './nav/nav.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchComponent } from './search/search.component';
import { SocialProfileComponent } from './profile/social-profile/social-profile.component';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    FileDropDirective,
    FileSelectDirective,
    BusinessComponent,
    NavComponent,
    ProfileComponent,
    SearchComponent,
    SocialProfileComponent
  ],
  entryComponents: [
    ProfileComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule
  ],
  exports: [
    BusinessComponent,
    NavComponent,
    ProfileComponent,
    SearchComponent,
    SocialProfileComponent
  ]
})
export class ComponentsModule { }
