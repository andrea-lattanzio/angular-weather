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
  private _locations$ = new BehaviorSubject<LocationInfoSimplified[] | null>(null);
  locations$ = this._locations$.asObservable();

  private _weatherInfo$ = new BehaviorSubject<WeatherData | null>(null);
  weatherInfo$ = this._weatherInfo$.asObservable();

  private _temperatureForecast$ = new BehaviorSubject<WeatherData | null>(null);
  temperatureForecast$ = this._temperatureForecast$.asObservable();

  httpClient = inject(HttpClient);

  constructor() {}

  /**
   * fetching location names from open-meteo GET /search endpoint
   * simplifying data type
   * stopping emission in case the api returns undefined
   * emitting fetched locations to observer objects (searchbar)
   * @param locationName location name to look for
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

  cleanLocations(): void {
    this._locations$.next(null);
  }

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
