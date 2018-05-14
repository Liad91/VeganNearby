import { AgmCoreModule } from '@agm/core';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// Config
import { environment } from '../environments/environment';
import { googleApiKey } from './../config';

// Components
import { AppComponent } from './app.component';

// Modules
import { CoreModule } from './core/core.module';

// Store
import { effects } from './store/app.effects';
import { reducers } from './store/app.reducer';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    CoreModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),
    AgmCoreModule.forRoot({
      apiKey: googleApiKey,
      libraries: ['places', 'geometry']
    }),
    // !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 10 }) : []
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
