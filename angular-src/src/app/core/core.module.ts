import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileDropDirective, FileSelectDirective } from 'ng2-file-upload';

// Components
import { AuthComponent } from './auth/auth.component';
import { AuthSocialComponent } from './auth/auth-social/auth-social.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { SearchComponent } from './search/search.component';

// Services
import * as Services from './services';
import { AuthService } from './auth/auth.service';
import { AuthSocialService } from './auth/auth-social/auth-social.service';

// Guards
import { AuthSocialGuard } from './auth/auth-social/auth-social.guard';

// Modules
import { AppRoutesModule } from './../app-routes.module';
import { SharedModule } from './../shared/shared.module';

@NgModule({
  declarations: [
    AuthComponent,
    AuthSocialComponent,
    HomeComponent,
    FileDropDirective,
    FileSelectDirective,
    NavComponent,
    SearchComponent
  ],
  entryComponents: [
    AuthComponent
  ],
  providers: [
    Services.ConnectionService,
    Services.ResizeService,
    Services.ToastService,
    Services.GeographicalService,
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
