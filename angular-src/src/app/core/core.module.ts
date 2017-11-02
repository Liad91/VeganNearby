import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileDropDirective, FileSelectDirective } from 'ng2-file-upload';

// Components
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthModalComponent } from './auth/auth-modal/auth-modal.component';
import { AuthSocialComponent } from './auth/auth-social/auth-social.component';
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
import { SharedModule } from './../shared/shared.module';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AuthModalComponent,
    AuthSocialComponent,
    HomeComponent,
    FileDropDirective,
    FileSelectDirective,
    NavComponent,
    SearchComponent
  ],
  entryComponents: [
    AuthModalComponent
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
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AppRoutesModule,
    SharedModule
  ],
  exports: [
    AppRoutesModule,
    NavComponent
  ]
})
export class CoreModule {}
