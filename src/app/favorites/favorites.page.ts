import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon
} from '@ionic/angular/standalone';
import { FavoritesService } from '../services/favorites.service';
import { Movie } from '../services/movie.service';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { HighlightDirective } from '../directives/highlight.directive';
import { addIcons } from 'ionicons';
import { heart, home, playCircle } from 'ionicons/icons';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    TruncatePipe,
    DatePipe,
    HighlightDirective
  ]
})
export class FavoritesPage implements OnInit {

  favorites: Movie[] = [];

  constructor(
    private favoritesService: FavoritesService,
    private router: Router
  ) {
    addIcons({ heart, home, playCircle });
  }

  ngOnInit() {
    this.loadFavorites();

    this.favoritesService.favorites$.subscribe(favs => {
      this.favorites = favs;
    });
  }

  loadFavorites() {
    this.favorites = this.favoritesService.getFavorites();
  }

  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie-details', movieId]);
  }

  removeFavorite(movieId: number, event: Event) {
    event.stopPropagation();
    this.favoritesService.removeFavorite(movieId);
  }

  isFavorite(movieId: number): boolean {
    return this.favoritesService.isFavorite(movieId);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}
