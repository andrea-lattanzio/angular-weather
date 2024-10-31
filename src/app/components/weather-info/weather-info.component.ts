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
  weatherSrv = inject(WeatherService);
  weatherInfo$ = this.weatherSrv.weatherInfo$;
  localStorageSrv = inject(LocalStorageService);
  isFavorite!: boolean;

  @Input() location!: LocationInfoSimplified | undefined;
  onLocationChange = output<LocationInfoSimplified | undefined>();

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['location'].currentValue) return;

    this.getWeatherInfo();
    this.isFavorite = this.localStorageSrv.isFavorite(this.location!);
  }

  getWeatherInfo(): void {
    this.weatherSrv.getLocationWeather(this.location!);
  }

  handleFavoriteClick(): void {
    if(this.localStorageSrv.isFavorite(this.location!)) {
      this.localStorageSrv.remove(this.location!);
      this.onLocationChange.emit(undefined);
    } else {
      this.localStorageSrv.add(this.location!);
    }
    this.isFavorite = !this.isFavorite;
  }
}
