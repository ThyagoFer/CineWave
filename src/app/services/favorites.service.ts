import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movie } from './movie.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesKey = 'cinewave_favorites';
  private favoritesSubject = new BehaviorSubject<Movie[]>(this.getFavoritesFromStorage());
  public favorites$: Observable<Movie[]> = this.favoritesSubject.asObservable();

  constructor() {}

  private getFavoritesFromStorage(): Movie[] {
    const stored = localStorage.getItem(this.favoritesKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveFavoritesToStorage(favorites: Movie[]): void {
    localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }

  getFavorites(): Movie[] {
    return this.favoritesSubject.value;
  }

  isFavorite(movieId: number): boolean {
    return this.getFavorites().some(movie => movie.id === movieId);
  }

  addFavorite(movie: Movie): void {
    const favorites = this.getFavorites();
    if (!this.isFavorite(movie.id)) {
      favorites.push(movie);
      this.saveFavoritesToStorage(favorites);
    }
  }

  removeFavorite(movieId: number): void {
    const favorites = this.getFavorites().filter(movie => movie.id !== movieId);
    this.saveFavoritesToStorage(favorites);
  }

  toggleFavorite(movie: Movie): void {
    if (this.isFavorite(movie.id)) {
      this.removeFavorite(movie.id);
    } else {
      this.addFavorite(movie);
    }
  }
}






