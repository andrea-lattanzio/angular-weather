import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LocationInfo, LocationInfoSimplified } from '../interfaces/location';
import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  tap,
  throwError,
} from 'rxjs';
import { weatherParams, WeatherData } from '../interfaces/weather';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  // BehaviorSubject stores a list of locations which is then expsed an an observable to ensure readonly access 
  private _locations$ = new BehaviorSubject<LocationInfoSimplified[] | null>(null);
  locations$ = this._locations$.asObservable();

  private _weatherInfo$ = new BehaviorSubject<WeatherData | null>(null);
  weatherInfo$ = this._weatherInfo$.asObservable();

  private _temperatureForecast$ = new BehaviorSubject<WeatherData | null>(null);
  temperatureForecast$ = this._temperatureForecast$.asObservable();

  httpClient = inject(HttpClient);

  constructor() {}

  /**
   * Fetching location names from open-meteo GET /search endpoint
   * Simplifying data type
   * Stopping emission in case the api returns undefined
   * Emitting fetched locations to observer objects (searchbar)
   * @param locationName - Location name to look for
   */
  getLocations(locationName: string): void {
    const params = new HttpParams().set('name', locationName);
    this.httpClient
      .get<LocationInfo>('https://geocoding-api.open-meteo.com/v1/search', {
        params,
      })
      .pipe(
        tap((res: LocationInfo) => {
          if (!res.results) this._locations$.next(null);
        }),
        filter((res: LocationInfo) => !!res.results && res.results.length > 0), // stopping stream if api returns undefined
        map((res: LocationInfo) =>
          res.results.map(
            (result) =>
              ({
                admin1: result.admin1,
                admin3: result.admin3,
                name: result.name,
                country: result.country,
                latitude: result.latitude,
                longitude: result.longitude,
              } as LocationInfoSimplified)
          )
        ),
        catchError((err) => {
          return throwError(() => err);
        })
      )
      .subscribe((res: LocationInfoSimplified[]) => {
        this._locations$.next(res);
      });
  }

  /**
   * Removing Suggested Locations when searchbar is destroyed
   */
  cleanLocations(): void {
    this._locations$.next(null);
  }

  /**
   * Getting CURRENT weather data for the chosen location from open-meteo GET /forecast endpoint
   * Once the data is returned the observable emits to its subscribers (weather-info component)
   * 
   * @param locationInfo - Currently selected location
   */
  getLocationWeather(locationInfo: LocationInfoSimplified): void {
    let params = new HttpParams()
      .set('latitude', locationInfo.latitude)
      .set('longitude', locationInfo.longitude)
      .set('current', weatherParams);
    this.httpClient
      .get<WeatherData>('https://api.open-meteo.com/v1/forecast', { params })
      .pipe(
        catchError((err) => {
          return throwError(() => err);
        })
      )
      .subscribe((res: WeatherData) => {
        this._weatherInfo$.next(res);
      });
  }

  /**
   * Getting HOURLY temperature forecast for the chosen location from the open-meteo GET /forecast endpoint
   * Once the data is returned the observable emits to its subscribers (temperature-graph component)
   * 
   * @param locationInfo - Currently selected location
   */
  getLocationTemperatures(locationInfo: LocationInfoSimplified): void {
    let params = new HttpParams()
      .set('latitude', locationInfo.latitude)
      .set('longitude', locationInfo.longitude)
      .set('hourly', 'temperature_2m');
      this.httpClient
      .get<WeatherData>('https://api.open-meteo.com/v1/forecast', { params })
      .pipe(
        catchError((err) => {
          return throwError(() => err);
        })
      )
      .subscribe((res: WeatherData) => {
        this._temperatureForecast$.next(res);
      });
  }
}
