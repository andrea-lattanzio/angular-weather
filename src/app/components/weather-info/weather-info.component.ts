import {
  Component,
  inject,
  Input,
  OnChanges,
  output,
  SimpleChanges,
} from '@angular/core';
import { LocationInfoSimplified } from '../../interfaces/location';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-weather-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-info.component.html',
  styleUrl: './weather-info.component.scss',
})
export class WeatherInfoComponent implements OnChanges {
  // Injected services for fetching weather data and managing favorite locations
  weatherSrv = inject(WeatherService);
  localStorageSrv = inject(LocalStorageService);
  // Observable holding weather data of currenly selected location
  weatherInfo$ = this.weatherSrv.weatherInfo$;
  // Flag property for template rendering
  isFavorite!: boolean;

  // Input property for receiving location data from the parent component
  @Input() location!: LocationInfoSimplified | undefined;
  // Output event emitter for when the location is marked as favorite or removed from favorites
  onFavoriteClick = output<LocationInfoSimplified | undefined>();

  /**
   * Detects changes to location Input property.
   * If a new location is received, the method fetches updated weather information
   * and checks if the location is already a favorite using the injected services.
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['location'].currentValue) return;

    this.getWeatherInfo();
    this.isFavorite = this.localStorageSrv.isFavorite(this.location!);
  }

  getWeatherInfo(): void {
    this.weatherSrv.getLocationWeather(this.location!);
  }

  /**
   * handles click for adding or removing location from favorites
   * if location is marked as favorites it will be removed
   * if location is not marked as favoriets it will be added
   */
  handleFavoriteClick(): void {
    if (this.localStorageSrv.isFavorite(this.location!)) {
      this.localStorageSrv.remove(this.location!);
      this.onFavoriteClick.emit(undefined);
    } else {
      this.localStorageSrv.add(this.location!);
    }
    this.isFavorite = !this.isFavorite;
  }
}
