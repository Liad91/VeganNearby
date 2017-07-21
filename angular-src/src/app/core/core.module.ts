import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

// Components
import { HomeComponent } from './home/home.component';

// Services
import { ConnectionService } from './../services/connection.service';
import { UsersService } from './../services/users.service';
import { NavigationService } from './../services/navigation.service';
import { YelpService } from './../services/yelp.service';
import { AuthService } from './../services/Auth.service';

// Modules
import { SharedModule } from './../shared/shared.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    ReactiveFormsModule,
    SharedModule,
    AgmCoreModule
  ],
  providers: [
    ConnectionService,
    UsersService,
    NavigationService,
    YelpService,
    AuthService
  ]
})
export class CoreModule { }