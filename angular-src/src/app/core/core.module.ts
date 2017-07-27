import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { RegistrationComponent } from './nav/registration/registration.component';
import { SearchComponent } from './search/search.component';

// Services
import { ConnectionService } from './../services/connection.service';
import { UsersService } from './../services/users.service';
import { YelpService } from './../services/yelp.service';
import { AuthService } from './../services/auth.service';
import { AppRenderer } from './../services/app-renderer.service';

// Modules
import { SharedModule } from './../shared/shared.module';

@NgModule({
  declarations: [
    HomeComponent,
    NavComponent,
    RegistrationComponent,
    SearchComponent
  ],
  entryComponents: [
    RegistrationComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AgmCoreModule
  ],
  providers: [
    ConnectionService,
    UsersService,
    YelpService,
    AuthService,
    AppRenderer
  ],
  exports: [
    NavComponent,
    SearchComponent
  ]
})
export class CoreModule { }