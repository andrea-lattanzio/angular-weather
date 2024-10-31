import { Component, inject } from '@angular/core';
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
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent {
  // Inject LocalStorageService to access favorite locations stored in local storage
  localStorageSrv = inject(LocalStorageService);
  // Observable stream for favorite locations, fetched from local storage
  favorites$ = this.localStorageSrv.favorites$;
  // Holds the location information for the selected favorite location
  selectedLocation!: LocationInfoSimplified | undefined;

  /**
   * Handles the emission of location data from the FavoriteLocationComponent.
   * When a favorite location is selected, the emitted value is passed here
   * and assigned to `selectedLocation`. This data can then be used as input
   * for the WeatherInfoComponent to display detailed weather information.
   *
   * @param event - The location information emitted by the FavoriteLocationComponent
   */
  handleEmission(event: LocationInfoSimplified | undefined): void {
    this.selectedLocation = event;
  }
}
