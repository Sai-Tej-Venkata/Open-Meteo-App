import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../../services/weather.service';

interface WeatherDataItem {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
  weatherCode: number;
}

@Component({
  selector: 'app-weather-display',
  imports: [CommonModule],
  templateUrl: './weather-display.component.html',
  styleUrl: './weather-display.component.scss',
})
export class WeatherDisplayComponent implements OnInit {
  weatherData = signal<WeatherDataItem[]>([]);
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
    
    console.log('ngOnInit: Calling weatherService.getWeather()');
    
    // Test endpoint first
    this.weatherService.testConnection().subscribe({
      next: (response) => {
        console.log('✅ Backend connection successful:', response);
      },
      error: (error) => {
        console.error('❌ Backend connection failed:', error);
        this.errorMessage.set('Cannot reach backend API. Ensure it is running on https://localhost:7174');
      }
    });
  }

  fetchWeatherData(): void {
    this.isLoading.set(true);

    this.weatherService.getWeather().subscribe({
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

      // Transform ALL responses, not just the first one
      if (Array.isArray(apiResponse) && apiResponse.length > 0) {
        apiResponse.forEach((response: any, responseIndex: number) => {
          console.log(`Processing response ${responseIndex + 1} of ${apiResponse.length}`);

          if (response?.daily) {
            const { time, temperature_2m_max, temperature_2m_min, precipitation, weather_code } = response.daily;

            const transformedRecords = time?.map((date: string, index: number) => ({
              date,
              temperatureMax: temperature_2m_max?.[index] ?? 0,
              temperatureMin: temperature_2m_min?.[index] ?? 0,
              precipitation: precipitation?.[index] ?? 0,
              weatherCode: weather_code?.[index] ?? 0
            })) || [];

            allWeatherData.push(...transformedRecords);
          }
        });

        console.log(`✅ Transformed ${allWeatherData.length} total weather records from ${apiResponse.length} response(s)`);
        this.weatherData.set(allWeatherData);
      } else {
        console.warn('⚠️ No data received from API');
        this.errorMessage.set('No weather data available');
      }
    } catch (error) {
      console.error('❌ Error transforming weather data:', error);
      this.errorMessage.set('Error processing weather data');
    }
  }
}
