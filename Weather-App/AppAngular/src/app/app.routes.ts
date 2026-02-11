import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'weather',
        pathMatch: 'full',
    },
    {
        path: 'weather',
        loadComponent: () =>
            import('./components/weather-display.component/weather-display.component').then(
                (m) => m.WeatherDisplayComponent
            ),
    }
];
