import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { AppConfigService } from './core/config/app-config.service';
import { timeout } from 'rxjs/operators';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    // importProvidersFrom(HttpClientModule),
    {
      provide: APP_INITIALIZER,
      useFactory: (config: AppConfigService) => () => {
        return new Promise((resolve) => {
          const timeout = setTimeout(() => {
            console.warn('Config loading timeout, continuing with defaults');
            resolve(true);
          }, 5000);

          config.loadConfig()
            .then(() => {
              clearTimeout(timeout);
              resolve(true);
            })
            .catch(error => {
              console.error('Failed to load config:', error);
              clearTimeout(timeout);
              resolve(true);
            });
        });
      },
      deps: [AppConfigService],
      multi: true
    }
  ]
};
