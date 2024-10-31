import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LocationInfoSimplified } from '../../interfaces/location';
import { WeatherService } from '../../services/weather.service';
import { Chart, registerables } from 'chart.js';
import { WeatherData } from '../../interfaces/weather';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-temperature-graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './temperature-graph.component.html',
  styleUrl: './temperature-graph.component.scss',
})
export class TemperatureGraphComponent implements OnChanges {
  destroyed = inject(DestroyRef);
  weatherSrv = inject(WeatherService);
  // observable stream containing temperature forecast for the selected location
  temperatureForecast$ = this.weatherSrv.temperatureForecast$;

  // chart instance, chart labels and values
  private chartInstance: Chart | null = null;
  private chartLabels: string[] = [];
  private chartValues: number[] = [];

  // Input property for receiving selected location from parent component
  @Input() location!: LocationInfoSimplified | undefined;

  /**
   * Responds to location input property changes.
   * When the location changes, it fetches the temperature forecast
   * and updates the chart data.
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['location'].currentValue) return;
    this.getTemperatureForecast();
  }

  /**
   * Fetches temperature forecast data by calling the WeatherService.
   * Subscribes to the temperatureForecast$ observable and, once data is
   * received, loads the data into the chart using loadChartData.
   */
  private getTemperatureForecast(): void {
    this.weatherSrv.getLocationTemperatures(this.location!);
    this.temperatureForecast$
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe((res: WeatherData | null) => {
        if (!res) return;
        this.loadChartData(res);
      });
  }

  /**
   * Extracts and formats the temperature data for a 24-hour period.
   * Sets the chart labels and values, then calls renderChart to
   * display the updated data.
   *
   * @param temperatures - contains hourly temperature data
   */
  loadChartData(temperatures: WeatherData): void {
    if (!temperatures.hourly) return;
    this.chartLabels = temperatures.hourly.time
      .slice(new Date().getHours(), new Date().getHours() + 25)
      .map((date) =>
        new Date(date).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    console.log(this.chartLabels);
    this.chartValues = temperatures.hourly.temperature_2m.slice(
      new Date().getHours(),
      new Date().getHours() + 24
    );
    this.renderChart();
  }

  /**
   * Initializes and renders the chart
   * Destroys any existing chart instance
   * Creates a new Chart instance
   */
  renderChart(): void {
    Chart.register(...registerables);
    this.chartInstance ? this.chartInstance.destroy() : null;
    this.chartInstance = new Chart('chartCanvas', {
      type: 'bar',
      data: {
        labels: this.chartLabels,
        datasets: [
          {
            label: 'Temperature',
            data: this.chartValues,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
