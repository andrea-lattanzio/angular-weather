import { Component } from '@angular/core';
import { WeatherInfoComponent } from '../../components/weather-info/weather-info.component';
import { SearchbarComponent } from '../../components/searchbar/searchbar.component';
import { TemperatureGraphComponent } from '../../components/temperature-graph/temperature-graph.component';
import { LocationInfoSimplified } from '../../interfaces/location';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [SearchbarComponent, WeatherInfoComponent, TemperatureGraphComponent],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent {
  selectedLocation!: LocationInfoSimplified | undefined;
  
  handleLocationChange(event: LocationInfoSimplified): void {
    this.selectedLocation = event;
  }
}
