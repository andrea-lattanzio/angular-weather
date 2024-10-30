import { ChartOptions } from 'chart.js';

export const weatherParams: string =
  'temperature_2m,relative_humidity_2m,is_day,precipitation,cloud_cover,wind_speed_10m';

export const lineChartOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    title: {
      display: true,
      text: 'Temperature in the Next 24 Hours',
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Time',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Temperature (°C)',
      },
      beginAtZero: false,
    },
  },
};

export interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units?: CurrentUnits;
  current?: CurrentWeather;
  hourly_units?: HourlyUnits;
  hourly?: HourlyData;
}

interface CurrentUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  is_day: string;
  precipitation: string;
  cloud_cover: string;
  wind_speed_10m: string;
}

interface CurrentWeather {
  time: number;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  is_day: number;
  precipitation: number;
  cloud_cover: number;
  wind_speed_10m: number;
}

interface HourlyUnits {
  time: number[];
  temperature_2m: number[];
}

interface HourlyData {
  time: number[];
  temperature_2m: number[];
}
