
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects'
import { AgmCoreModule } from '@agm/core';

// Components
import { AppComponent } from './app.component';

// Modules
import { CoreModule } from './core/core.module';

// Config
import { reducers } from './store/app.reducers';
import { effects } from './store/app.effects';
import { googleMapApiKey } from './../config';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CoreModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),
    AgmCoreModule.forRoot({
      apiKey: googleMapApiKey,
      libraries: ['places', 'geometry']
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
