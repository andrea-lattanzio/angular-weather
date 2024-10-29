import { Component } from '@angular/core';
import { WeatherInfoComponent } from '../../components/weather-info/weather-info.component';
import { SearchbarComponent } from '../../components/searchbar/searchbar.component';
import { TemperatureGraphComponent } from '../../components/temperature-graph/temperature-graph.component';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [SearchbarComponent, WeatherInfoComponent, TemperatureGraphComponent],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent {

}
