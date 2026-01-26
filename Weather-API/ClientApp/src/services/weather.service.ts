import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiUrl = 'https://localhost:7174/api/v1/weather';
  private healthUrl = 'https://localhost:7174/api/health';

  constructor(private http: HttpClient) {
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

  getWeather(): Observable<any> {
    console.log('Fetching weather from:', this.apiUrl);
    return this.http.get<any>(this.apiUrl).pipe(
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
      console.error('🔴 Network Error Detected:');
      console.error('   - Backend server is not running');
      console.error('   - CORS policy may be blocking the request');
      console.error('   - Check if https://localhost:7174 is accessible');
      console.error('   - Try: dotnet run in the Weather-API directory');
    }
  }
}
