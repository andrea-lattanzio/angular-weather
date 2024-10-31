import { Injectable } from '@angular/core';
import { LocationInfoSimplified } from '../interfaces/location';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private favoriteKey = 'favorites';
  // Array of favorite location, stores the data that is fetched from localStorage
  private favorites: LocationInfoSimplified[] = [];

  // Behaviour subject holds the favorite locations, favorites$ exposes them to observer
  // components (favorites.component)
  private _favorites$ = new BehaviorSubject<LocationInfoSimplified[] | null>(null);
  favorites$ = this._favorites$.asObservable();

  /**
   * Fetching the list of favorites from localStorage when the service is created
   * Emitting the found list of favorites
   */
  constructor() {
    const favoritesJson = localStorage.getItem('favorites');
    this.favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
    this._favorites$.next(this.favorites);
  }

  /**
   * Adding new location to favorites array
   * Setting updated array inside of localStorage
   * Emitting updated array to update observer components
   * 
   * @param location - New location to mark as favorite
   */
  add(location: LocationInfoSimplified): void {
    this.favorites.push(location);
    localStorage.setItem(this.favoriteKey, JSON.stringify(this.favorites));
    this._favorites$.next(this.favorites);
  }

  /**
   * Checks if a location is marked as public
   * Referenced in weather-info component to add or remove from favorites
   * 
   * @param location - location to check for
   * @returns - true or false if the location is marked as favorite or not
   */
  isFavorite(location: LocationInfoSimplified): boolean {
    return this.favorites.some(
      (fav) =>
        fav.latitude === location.latitude &&
        fav.longitude === location.longitude
    );
  }

  /**
   * Finding the index of the location to remove
   * If an index is found removing the location on that index
   * Updating saved locations in localStorage
   * Emitting updated favorite list
   * 
   * @param location - Location to remove
   */
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
