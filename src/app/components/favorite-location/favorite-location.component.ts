import { Component, inject, Input, output } from '@angular/core';
import { LocationInfoSimplified } from '../../interfaces/location';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-favorite-location',
  standalone: true,
  imports: [],
  templateUrl: './favorite-location.component.html',
  styleUrl: './favorite-location.component.scss'
})
export class FavoriteLocationComponent {
  localStorageSrv = inject(LocalStorageService);

  @Input() location!: LocationInfoSimplified | undefined;
  onLocationChange = output<LocationInfoSimplified | undefined>();

  handleLocationClick(): void {
    this.onLocationChange.emit(this.location!);
  }

  removeFromFavorites(): void {
    this.onLocationChange.emit(undefined);
    this.localStorageSrv.remove(this.location!);
  }
}
