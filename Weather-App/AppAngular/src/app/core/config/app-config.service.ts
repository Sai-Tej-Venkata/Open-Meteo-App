import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private config: any = {};

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any) { 
    // Initialize with default config
    this.config = {
      weatherApiUrl: 'https://localhost:7174/api/v1/weather',
      appName: 'Weather App'
    };
  }

  loadConfig(): Promise<any> {
    const configUrl = (environment && environment.configUrl) ? environment.configUrl : '/config.json';

    if (isPlatformBrowser(this.platformId)) {
      return fetch(configUrl)
        .then(res => {
          if (!res.ok) {
            throw new Error(`Failed to load config: ${res.status}`);
          }
          return res.json();
        })
        .then(config => {
          this.config = { ...this.config, ...config };
          console.log('Config loaded successfully (browser):', this.config);
          return this.config;
        })
        .catch(error => {
          console.warn('Failed to load config from file (browser), using defaults:', error);
          return this.config;
        });
    }

    if (isPlatformServer(this.platformId)) {
      return new Promise((resolve) => {
        try {
          const fs = require('fs');
          const path = require('path');
          const candidates = [
            path.join(process.cwd(), 'public', 'config.json'),
            path.join(process.cwd(), 'dist', 'browser', 'config.json'),
            path.join(process.cwd(), 'config.json')
          ];
          const found = candidates.find(p => fs.existsSync(p));
          if (!found) {
            console.warn('Config file not found on server; using defaults');
            return resolve(this.config);
          }
          const raw = fs.readFileSync(found, 'utf8');
          const json = JSON.parse(raw);
          this.config = { ...this.config, ...json };
          console.log('Config loaded successfully (server):', found);
          return resolve(this.config);
        } catch (err) {
          console.warn('Failed to load config from file (server), using defaults:', err);
          return resolve(this.config);
        }
      });
    }

    // Fallback: return defaults
    return Promise.resolve(this.config);
  }

  get<T>(key: string): T {
    const value = this.config[key];
    if (!value) {
      console.warn(`Config key not found: ${key}`);
    }
    return value;
  }
}
