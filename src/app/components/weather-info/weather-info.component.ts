import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LocationInfoSimplified } from '../../interfaces/location';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-info.component.html',
  styleUrl: './weather-info.component.scss'
})
export class WeatherInfoComponent implements OnChanges {
  weatherSrv = inject(WeatherService);
  weatherInfo$ = this.weatherSrv.weatherInfo$;
  
  @Input() location!: LocationInfoSimplified | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if(!changes['location'].currentValue)
      return;
    
    this.getWeatherInfo();
  }

  getWeatherInfo(): void {
    this.weatherSrv.getLocationWeather(this.location!);
  }
}
