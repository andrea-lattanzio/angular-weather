import { Injectable } from '@angular/core';
import { LocationInfoSimplified } from '../interfaces/location';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private favoriteKey = 'favorites';
  private favorites: LocationInfoSimplified[] = [];

  private _favorites$ = new BehaviorSubject<LocationInfoSimplified[] | null>(null);
  favorites$ = this._favorites$.asObservable();

  constructor() {
    const favoritesJson = localStorage.getItem('favorites');
    this.favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
    this._favorites$.next(this.favorites);
  }

  add(location: LocationInfoSimplified): void {
    this.favorites.push(location);
    localStorage.setItem(this.favoriteKey, JSON.stringify(this.favorites));
    this._favorites$.next(this.favorites);
  }

  isFavorite(location: LocationInfoSimplified): boolean {
    return this.favorites.some(
      (fav) =>
        fav.latitude === location.latitude &&
        fav.longitude === location.longitude
    );
  }

  remove(location: LocationInfoSimplified): void {
    const index = this.favorites.findIndex(
      (fav) =>
        fav.latitude === location.latitude &&
        fav.longitude === location.longitude
    );

    if (index !== -1) {
      this.favorites.splice(index, 1);
      localStorage.setItem(this.favoriteKey, JSON.stringify(this.favorites));
    }

    this._favorites$.next(this.favorites);
  }
}
