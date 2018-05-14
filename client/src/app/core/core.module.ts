import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';

// Components
import * as Components from './components';

// Directives
import * as Directives from './directives';

// Guards
import { AuthSocialGuard } from './components/auth/auth-social/auth-social.guard';

// Modules
import { AppRoutesModule } from './../app-routes.module';
import { SharedModule } from './../shared/shared.module';

// Pipes
import * as Pipes from './pipes';

// Services
import * as Services from './services';
import { AuthService } from './components/auth/auth.service';
import { AuthSocialService } from './components/auth/auth-social/auth-social.service';
import { PlacesService } from '../places/places.service';

@NgModule({
  declarations: [
    Components.AuthModalComponent,
    Components.AuthSocialComponent,
    Components.CarouselComponent,
    Components.CuisinesModalComponent,
    Components.EditModalComponent,
    Components.HomeComponent,
    Components.LightboxModalComponent,
    Components.LoginComponent,
    Components.NavComponent,
    Components.RegisterComponent,
    Components.SearchComponent,
    Components.TabItemComponent,
    Components.TabsComponent,
    Components.TypedComponent,
    Directives.ImagePreviewDirective,
    Directives.SelectDirective,
    Directives.SidenavButtonDirective,
    Directives.TooltipDirective,
    Pipes.SearchFilterPipe
  ],
  entryComponents: [
    Components.AuthModalComponent,
    Components.CuisinesModalComponent,
    Components.EditModalComponent,
    Components.LightboxModalComponent
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
    FormsModule,
    AppRoutesModule,
    FileUploadModule,
    SharedModule
  ],
  exports: [
    AppRoutesModule,
    Components.NavComponent
  ]
})
export class CoreModule { }
