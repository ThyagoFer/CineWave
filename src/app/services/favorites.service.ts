import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movie } from './movie.service';
import { AuthService, User } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly FAVORITES_PREFIX = 'cinewave_favorites_';
  private readonly GUEST_KEY = 'cinewave_favorites_guest';
  
  private favoritesSubject = new BehaviorSubject<Movie[]>([]);
  public favorites$: Observable<Movie[]> = this.favoritesSubject.asObservable();

  private currentUserId: string | null = null;

  constructor(private authService: AuthService) {
    this.loadCurrentUserFavorites();
    this.authService.currentUser$.subscribe(user => {
      this.onUserChange(user);
    });
  }

  private onUserChange(user: User | null): void {
    const newUserId = user?.id || null;
    if (this.currentUserId !== newUserId) {
      this.currentUserId = newUserId;
      this.loadCurrentUserFavorites();
    }
  }

  private getStorageKey(): string {
    if (this.currentUserId) {
      return `${this.FAVORITES_PREFIX}${this.currentUserId}`;
    }
    return this.GUEST_KEY;
  }

  private loadCurrentUserFavorites(): void {
    const user = this.authService.getCurrentUser();
    this.currentUserId = user?.id || null;
    const favorites = this.getFavoritesFromStorage();
    this.favoritesSubject.next(favorites);
  }

  private getFavoritesFromStorage(): Movie[] {
    const key = this.getStorageKey();
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }

  private saveFavoritesToStorage(favorites: Movie[]): void {
    const key = this.getStorageKey();
    localStorage.setItem(key, JSON.stringify(favorites));
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

  getFavoritesCount(): number {
    return this.getFavorites().length;
  }

  clearFavorites(): void {
    this.saveFavoritesToStorage([]);
  }

  migrateGuestFavorites(): void {
    if (!this.currentUserId) return;

    const guestFavorites = localStorage.getItem(this.GUEST_KEY);
    if (guestFavorites) {
      const guestList: Movie[] = JSON.parse(guestFavorites);
      const currentList = this.getFavorites();
      const mergedFavorites = [...currentList];
      
      guestList.forEach(movie => {
        if (!mergedFavorites.some(m => m.id === movie.id)) {
          mergedFavorites.push(movie);
        }
      });
      
      this.saveFavoritesToStorage(mergedFavorites);
      localStorage.removeItem(this.GUEST_KEY);
    }
  }
}
