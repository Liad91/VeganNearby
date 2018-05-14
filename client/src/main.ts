import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as WebFont from 'webfontloader/webfontloader';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

WebFont.load({
  google: {
    families: ['Raleway:400,500,600,700']
  },
  timeout: 2000
});

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
