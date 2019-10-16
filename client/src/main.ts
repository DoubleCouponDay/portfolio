import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { ismobile } from './app/utility/utilities';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

if(ismobile() === true) {
  let newstyle = document.createElement('style')
  document.head.appendChild(newstyle)
  let stylesheet = <CSSStyleSheet>newstyle.sheet

  stylesheet.insertRule(`
    html, body {
      overflow-y: auto;
    }
  `)  
}