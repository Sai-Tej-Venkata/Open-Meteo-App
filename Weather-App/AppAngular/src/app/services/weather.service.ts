import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConfigService } from '../core/config/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiUrl = '';
  private healthUrl = 'https://localhost:7174/api/health';

  constructor(private http: HttpClient, private appConfigService: AppConfigService) {
    // Config should already be loaded by APP_INITIALIZER, but handle gracefully
    const configUrl = this.appConfigService.get<string>('weatherApiUrl');
    if (configUrl) {
      this.apiUrl = configUrl;
    } else {
      console.error('Weather API URL not found in config, using default');
    }
  }

  testConnection(): Observable<any> {
    console.log('Testing connection to:', this.healthUrl);
    return this.http.get<any>(this.healthUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        this.logError('Health check failed', error);
        return throwError(() => error);
      })
    );
  }

  getWeather(latitude: number, longitude: number): Observable<any> {
    console.log('Fetching weather from:', this.apiUrl);

    const params = new HttpParams()
      .set('latitude', latitude)
      .set('longitude', longitude);

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.logError('Weather API call failed', error);
        return throwError(() => error);
      })
    );
  }

  private logError(context: string, error: HttpErrorResponse): void {
    console.error(`❌ ${context}`, {
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      url: error.url,
      error: error.error
    });

    if (error.status === 0) {
      console.error('🔴 Network Error Detected or Backend server is not running');
    }
  }
}
