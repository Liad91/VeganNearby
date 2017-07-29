import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';

// Components
import { AppComponent } from './app.component';

// Modules
import { AppRoutesModule } from './app-routes.module';
import { CoreModule } from './core/core.module';

// Config
import { googleApiKey } from '../config';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    AppRoutesModule,
    CoreModule,
    AgmCoreModule.forRoot({
      apiKey: googleApiKey,
      libraries: ['places']
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
