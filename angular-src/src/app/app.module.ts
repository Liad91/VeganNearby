import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';

// Services
import * as Services from './services';
import { FiltersService } from './pages/places/places-list/filters/filters.service';
import { PlacesService } from './pages/places/places.service';
import { ProfileService } from './components/profile/profile.service';
import { SocialProfileService } from './components/profile/social-profile/social-profile.service';

// Guards
import { CanActivateSocialProfile } from './components/profile/social-profile/social-profile.guard';
import { CanActivatePlaces } from './pages/places/places.guard';

// Modules
import { AppRoutesModule } from './app-routes.module';
import { ComponentsModule } from './components/components.module';
import { SharedModule } from './shared/shared.module';

// Config
import { googleMapApiKey } from './../config';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutesModule,
    ComponentsModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: googleMapApiKey,
      libraries: ['places', 'geometry']
    })
  ],
  providers: [
    CanActivateSocialProfile,
    CanActivatePlaces,
    FiltersService,
    PlacesService,
    ProfileService,
    SocialProfileService,
    Services.AuthService,
    Services.ConnectionService,
    Services.RendererService,
    Services.ResizeService,
    Services.ToastService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
