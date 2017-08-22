import { ToastService } from './services/toast.service';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';

// Components
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';

import { SearchComponent } from './search/search.component';
import { ProfileComponent } from './nav/profile/profile.component';
import { SocialProfileComponent } from './nav/profile/social-profile/social-profile.component';

// Services
import * as Services from './services';
import { ProfileService } from './nav/profile/profile.service';
import { SocialProfileService } from './nav/profile/social-profile/social-profile.service';
import { PlacesService } from './../places/places.service';

// Guards
import { CanActivateSocialProfile } from './nav/profile/social-profile/social-profile.guard';
import { CanActivatePlaces } from './../places/places.guard';

// Modules
import { SharedModule } from './../shared/shared.module';

@NgModule({
  declarations: [
    HomeComponent,
    NavComponent,
    ProfileComponent,
    SocialProfileComponent,
    SearchComponent,
    FileDropDirective,
    FileSelectDirective
  ],
  entryComponents: [
    ProfileComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AgmCoreModule
  ],
  providers: [
    Services.AuthService,
    Services.ConnectionService,
    Services.RendererService,
    Services.ToastService,
    ProfileService,
    SocialProfileService,
    CanActivateSocialProfile,
    PlacesService,
    CanActivatePlaces
  ],
  exports: [
    NavComponent,
    SearchComponent
  ]
})
export class CoreModule { }
