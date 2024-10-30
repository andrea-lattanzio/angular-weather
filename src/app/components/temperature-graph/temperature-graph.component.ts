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
  temperatureForecast$ = this.weatherSrv.temperatureForecast$;
  
  private chartInstance: Chart | null = null; 
  private chartLabels: string[] = [];
  private chartValues: number[] = [];

  @Input() location!: LocationInfoSimplified | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['location'].currentValue) return;
    this.getTemperatureForecast();
  }

  private getTemperatureForecast(): void {
    this.weatherSrv.getLocationTemperatures(this.location!);
    this.temperatureForecast$
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe((res: WeatherData | null) => {
        if (!res) return;
        this.loadChartData(res);
      });
  }

  loadChartData(temperatures: WeatherData): void {
    if (!temperatures.hourly) return;
    this.chartLabels = temperatures.hourly.time
      .slice(new Date().getHours(), 24)
      .map((date) =>
        new Date(date).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    this.chartValues = temperatures.hourly.temperature_2m.slice(
      new Date().getHours(),
      24
    );
    this.renderChart();
  }

  renderChart(): void {
    Chart.register(...registerables);
    this.chartInstance ? this.chartInstance.destroy() : null;
    this.chartInstance = new Chart('chartCanvas', {
      type: 'bar',
      data: {
        labels: this.chartLabels,
        datasets: [
          {
            label: 'Temperature Forecast',
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
