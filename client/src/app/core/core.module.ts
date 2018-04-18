import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Components
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthModalComponent } from './auth/auth-modal/auth-modal.component';
import { AuthSocialComponent } from './auth/auth-social/auth-social.component';
import { EditModalComponent } from './auth/edit-modal/edit-modal.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { SearchComponent } from './search/search.component';

// Services
import * as Services from './services';

import { AuthService } from './auth/auth.service';
import { AuthSocialService } from './auth/auth-social/auth-social.service';
import { PlacesService } from '../places/places.service';

// Guards
import { AuthSocialGuard } from './auth/auth-social/auth-social.guard';

// Modules
import { AppRoutesModule } from './../app-routes.module';
import { FileUploadModule } from 'ng2-file-upload';
import { SharedModule } from './../shared/shared.module';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AuthModalComponent,
    AuthSocialComponent,
    EditModalComponent,
    HomeComponent,
    NavComponent,
    SearchComponent
  ],
  entryComponents: [
    AuthModalComponent,
    EditModalComponent
  ],
  providers: [
    Services.ConnectionService,
    Services.UtilitiesService,
    Services.ToastService,
    Services.GeographicalService,
    Services.ModalService,
    PlacesService,
    AuthService,
    AuthSocialService,
    AuthSocialGuard
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AppRoutesModule,
    FileUploadModule,
    SharedModule
  ],
  exports: [
    AppRoutesModule,
    NavComponent
  ]
})
export class CoreModule { }
