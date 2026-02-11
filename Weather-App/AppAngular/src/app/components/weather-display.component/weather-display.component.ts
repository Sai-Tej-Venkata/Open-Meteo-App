import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { GeoCoordinatesComponent } from "../geo-coordinates.component/geo-coordinates.component";

interface WeatherDataIndex {
  latitude: number;
  longitude: number;
  timezone: string;
}

interface WeatherDataItem {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
}

interface WeatherErros {
  date: string;
  error: string;
}

@Component({
  selector: 'app-weather-display',
  imports: [CommonModule, GeoCoordinatesComponent],
  templateUrl: './weather-display.component.html',
  styleUrl: './weather-display.component.scss',
})
export class WeatherDisplayComponent implements OnInit {
  latitude: number = 0;
  longitude: number = 0;

  dateSortDirection: 'asc' | 'desc' = 'asc';

  weatherIndex = signal<WeatherDataIndex>({
    latitude: 0,
    longitude: 0,
    timezone: ''
  });
  weatherData = signal<WeatherDataItem[]>([]);
  weatherApiErrors = signal<[string, string][]>([]);
  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  constructor(private weatherService: WeatherService) {
    console.log('WeatherDisplayComponent instantiated');
  }

  get weatherDataExists(): boolean {
    return this.weatherData()?.length > 0;
  }

  ngOnInit(): void {
    this.errorMessage.set(null);

    // Test health-check endpoint first
    //this.weatherService.testConnection().subscribe({
    //  next: (response) => {
    //    console.log('✅ Backend connection successful:', response);
    //  },
    //  error: (error) => {
    //    console.error('❌ Backend connection failed:', error);
    //    this.errorMessage.set('Cannot reach backend API. Ensure it is running on https://localhost:7174');
    //  }
    //});
  }

  fetchWeatherData(): void {
    this.weatherData.set([]);
    console.log('ngOnInit: Calling weatherService.getWeather()');

    this.isLoading.set(true);

    this.weatherService.getWeather(this.latitude, this.longitude).subscribe({
      next: (data) => {
        console.log('✅ Weather data received:', data);
        this.transformAndSetWeatherData(data);

        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('❌ Error fetching weather data:', error);
        this.errorMessage.set(`Error: ${error.message || 'Failed to fetch weather data'}`);
        this.isLoading.set(false);
      }
    });
  }

  private transformAndSetWeatherData(apiResponse: any): void {
    try {
      console.log('Transforming weather data...');
      const allWeatherData: WeatherDataItem[] = [];

      const weatherResult = apiResponse.weatherDataList;
      const resultErrors = apiResponse.errorsHash;
      if (weatherResult.length === 0 || resultErrors == null) {
        console.warn('⚠️ No data received from API');
        this.errorMessage.set('No weather data available');
        return;
      }
      else if (Array.isArray(weatherResult) && weatherResult.length > 0) {
        weatherResult.forEach((response: any, responseIndex: number) => {
          console.log(`Processing response ${responseIndex + 1} of ${weatherResult.length}`);

          this.weatherIndex.set({
            latitude: response?.latitude,
            longitude: response?.longitude,
            timezone: response?.timezone
          });

          if (response?.daily) {
            const { time, temperature_2m_max, temperature_2m_min, precipitation } = response.daily;

            const transformedRecords = time?.map((date: string, index: number) => ({
              date,
              temperatureMax: temperature_2m_max?.[index] ?? 0,
              temperatureMin: temperature_2m_min?.[index] ?? 0,
              precipitation: precipitation?.[index] ?? 0,
            })) || [];

            allWeatherData.push(...transformedRecords);
          }
        });

        console.log(`✅ Transformed ${allWeatherData.length} total weather records from ${apiResponse.length} response(s)`);
        this.weatherData.set(allWeatherData);
      }

      if (resultErrors != null) {
        console.log(`Processing errors - ` + resultErrors);

        //for (const [key, value] of Object.entries(resultErrors)) { console.log('Key:', key); console.log('Value:', value); }

        this.weatherApiErrors.set(Object.entries(resultErrors));
        console.log(this.weatherApiErrors());
      }

    } catch (error) {
      console.error('❌ Error transforming weather data:', error);
      this.errorMessage.set('Error processing weather data');
    }
  }

  updateLatitude(value: number) {
    this.latitude = value;
  }

  updateLongitude(value: number) {
    this.longitude = value;
  }

  sortByDate(direction: 'asc' | 'desc') {

    const sorted = [...this.weatherData()].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      return direction === 'desc' ? dateA - dateB : dateB - dateA;
    });

    this.weatherData.set(sorted);
  }

  toggleDateSort() {

    this.sortByDate(this.dateSortDirection);
    this.dateSortDirection = this.dateSortDirection === 'asc' ? 'desc' : 'asc';
  }

}
