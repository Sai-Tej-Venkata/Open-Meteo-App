import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeatherDisplayComponent } from './components/weather-display.component/weather-display.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WeatherDisplayComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Open-Meteo-ClientApp');
}
