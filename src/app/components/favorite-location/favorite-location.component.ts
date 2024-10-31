import { Component, inject, Input, output } from '@angular/core';
import { LocationInfoSimplified } from '../../interfaces/location';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-favorite-location',
  standalone: true,
  imports: [],
  templateUrl: './favorite-location.component.html',
  styleUrl: './favorite-location.component.scss',
})
export class FavoriteLocationComponent {
  // Injecting localstorage to remove location from favorites
  localStorageSrv = inject(LocalStorageService);
  // Receiving location info by parent component
  @Input() location!: LocationInfoSimplified | undefined;
  // Emitting selected location to parent component
  onLocationChange = output<LocationInfoSimplified | undefined>();

  handleLocationClick(): void {
    this.onLocationChange.emit(this.location!);
  }

  /**
   * Removes favorite location from localStorage
   * Emits an undefined value to close currently selected location
   * since it's no longer marked as favorite
   */
  removeFromFavorites(): void {
    this.onLocationChange.emit(undefined);
    this.localStorageSrv.remove(this.location!);
  }
}
