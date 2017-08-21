import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';

// Components
import { AppComponent } from './app.component';
import { PlacesComponent } from './places/places.component';

// Modules
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutesModule } from './app-routes.module';
import { CoreModule } from './core/core.module';

// Config
import { googleMapApiKey } from '../config';

@NgModule({
  declarations: [
    AppComponent,
    PlacesComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    AppRoutesModule,
    FlexLayoutModule,
    CoreModule,
    AgmCoreModule.forRoot({
      apiKey: googleMapApiKey,
      libraries: ['places']
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
