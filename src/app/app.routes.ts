import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'weather',
    loadComponent: () => import('./pages/weather/weather.component').then((m) => m.WeatherComponent),
  },
  {
    path: 'favorites',
    loadComponent: () => import('./pages/favorites/favorites.component').then((m) => m.FavoritesComponent),
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];