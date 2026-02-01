import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppConfigService } from './core/config/app-config.service';
import { GeoCoordinatesComponent } from './components/geo-coordinates.component/geo-coordinates.component';
import { WeatherDisplayComponent } from './components/weather-display.component/weather-display.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  //  declarations: [
  //    WeatherDisplayComponent,
  //    GeoCoordinatesComponent
  //  ],
  imports: [
    BrowserModule
  ],
  // providers:
  //   [
  //     {
  //       provide: APP_INITIALIZER,
  //       useFactory: (config: AppConfigService) => () => config.loadConfig(),
  //       deps: [AppConfigService],
  //       multi: true
  //     }
  //   ],
  //bootstrap: [WeatherDisplayComponent]
})
export class AppModule { }

