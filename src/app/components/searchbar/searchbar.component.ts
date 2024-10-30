import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, fromEvent, map } from 'rxjs';
import { WeatherService } from '../../services/weather.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocationInfoSimplified } from '../../interfaces/location';


@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss',
})
export class SearchbarComponent implements AfterViewInit, OnDestroy {
  weatherSrv = inject(WeatherService);
  destroyed = inject(DestroyRef);

  @ViewChild('locationInput') locationInput!: ElementRef<HTMLInputElement>;
  locations$ = this.weatherSrv.locations$;
  chosenLocation!: string | undefined;
  suggestions: boolean = true;

  onLocationChange = output<LocationInfoSimplified>();
  elementRef: any;

  /**
   * declaring an observable out of the searchbar element
   * the observable emits each time an input is detected, with a debounce of 200ms
   * when the observable emits, refreshLocations method is called
   */
  ngAfterViewInit(): void {
    fromEvent(this.locationInput.nativeElement, 'input')
      .pipe(debounceTime(200), takeUntilDestroyed(this.destroyed))
      .subscribe((_) => this.refreshLocations(this.locationInput.nativeElement.value));
  }

  /**
   * calling getLocationsMethod of the weatherService
   * @param locationName name of the location to look for
   */
  refreshLocations(locationName: string): void {
    this.weatherSrv.getLocations(locationName);
  }

  /**
   * emitting location object
   * setting current location name
   * closing suggestions
   * @param location object to emit
   */
  handleLocationClik(location: LocationInfoSimplified): void {
    this.onLocationChange.emit(location);
    this.suggestions = false;
    this.chosenLocation = location.name+', '+location.admin1+', '+location.country;
  }

  toggleSuggestions(): void {
    this.suggestions = true;
  }

  ngOnDestroy(): void {
    this.weatherSrv.cleanLocations();
  }
}
