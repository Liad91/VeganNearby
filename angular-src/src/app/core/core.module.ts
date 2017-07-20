import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

// Components
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { LogComponent } from './log/log.component';

// Services
import { ConnectionService } from './../services/connection.service';
import { UsersService } from './../services/users.service';
import { NavigationService } from './../services/navigation.service';
import { YelpService } from './../services/yelp.service';

// Modules
import { SharedModule } from './../shared/shared.module';
import { RegistrationComponent } from './nav/registration/registration.component';

@NgModule({
  declarations: [
    NavComponent,
    HomeComponent,
    LogComponent,
    RegistrationComponent
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
  exports: [
    NavComponent
  ],
  providers: [
    ConnectionService,
    UsersService,
    NavigationService,
    YelpService
  ]
})
export class CoreModule { }