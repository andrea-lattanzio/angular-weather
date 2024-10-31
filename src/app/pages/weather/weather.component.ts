import { Component } from '@angular/core';
import { WeatherInfoComponent } from '../../components/weather-info/weather-info.component';
import { SearchbarComponent } from '../../components/searchbar/searchbar.component';
import { TemperatureGraphComponent } from '../../components/temperature-graph/temperature-graph.component';
import { LocationInfoSimplified } from '../../interfaces/location';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    SearchbarComponent,
    WeatherInfoComponent,
    TemperatureGraphComponent,
  ],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
})
export class WeatherComponent {
  /**
   * Currently selected location
   */
  selectedLocation!: LocationInfoSimplified | undefined;

  /**
   * Takes an emitted value (LocationInfoSimplified) from the SearchbarComponent
   * and passes it as an input to the WeatherInfoComponent and TemperatureGraphComponent.
   * This allows the two components to update based on the selected location.
   *
   * @param event - The location information emitted by the SearchbarComponent
   */
  handleLocationChange(event: LocationInfoSimplified): void {
    this.selectedLocation = event;
  }
}
