import { Component, inject, OnInit } from '@angular/core';
import { LocationInfoSimplified } from '../../interfaces/location';
import { LocalStorageService } from '../../services/local-storage.service';
import { CommonModule } from '@angular/common';
import { WeatherInfoComponent } from '../../components/weather-info/weather-info.component';
import { FavoriteLocationComponent } from '../../components/favorite-location/favorite-location.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, WeatherInfoComponent, FavoriteLocationComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent {
  localStorageSrv = inject(LocalStorageService);
  favorites$ = this.localStorageSrv.favorites$;

  selectedLocation!: LocationInfoSimplified | undefined;
  
  handleLocationChange(event: LocationInfoSimplified | undefined): void {
    this.selectedLocation = event;
  }
}
