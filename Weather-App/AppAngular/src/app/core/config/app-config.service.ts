import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private config: any = {};

  constructor(private http: HttpClient) { 
    // Initialize with default config
    this.config = {
      weatherApiUrl: 'https://localhost:7174/api/v1/weather',
      appName: 'Weather App'
    };
  }

  loadConfig(): Promise<any> {
    return fetch('/config.json')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to load config: ${res.status}`);
        }
        return res.json();
      })
      .then(config => {
        this.config = { ...this.config, ...config };
        console.log('Config loaded successfully:', this.config);
        return this.config;
      })
      .catch(error => {
        console.warn('Failed to load config from file, using defaults:', error);
        return this.config;
      });
  }

  get<T>(key: string): T {
    const value = this.config[key];
    if (!value) {
      console.warn(`Config key not found: ${key}`);
    }
    return value;
  }
}
