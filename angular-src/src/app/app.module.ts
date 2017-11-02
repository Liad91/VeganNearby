import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// Components
import { AppComponent } from './app.component';

// Modules
import { CoreModule } from './core/core.module';

// Store
import { reducers } from './store/app.reducers';
import { effects } from './store/app.effects';

// Config
import { environment } from '../environments/environment';
import { lazyMapsAPILoaderConfigLiteral } from './../config';

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
    AgmCoreModule.forRoot(lazyMapsAPILoaderConfigLiteral),
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 3 }) : []
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
