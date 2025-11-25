import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonButton,
  IonButtons,
  IonSpinner,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartOutline, play, informationCircle, playCircle, personCircle } from 'ionicons/icons';
import { MovieService, Movie } from '../services/movie.service';
import { FavoritesService } from '../services/favorites.service';
import { AuthService } from '../services/auth.service';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { HighlightDirective } from '../directives/highlight.directive';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonButton,
    IonSpinner,
    IonIcon,
    IonButtons,
    TruncatePipe,
    HighlightDirective
  ],
})
export class HomePage implements OnInit {
  movies: Movie[] = [];
  featuredMovies: Movie[] = [];
  trendingMovies: Movie[] = [];
  topRatedMovies: Movie[] = [];
  continueWatching: Movie[] = [];
  actionMovies: Movie[] = [];
  comedyMovies: Movie[] = [];
  dramaMovies: Movie[] = [];
  horrorMovies: Movie[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  searchQuery = '';
  selectedMovie: Movie | null = null;

  constructor(
    private movieService: MovieService,
    private router: Router,
    public favoritesService: FavoritesService,
    public authService: AuthService
  ) {
    addIcons({ heart, heartOutline, play, informationCircle, playCircle, personCircle });
  }

  ngOnInit() {
    this.loadMovies();
    this.loadTrendingMovies();
    this.loadTopRatedMovies();
    this.loadContinueWatching();
    this.loadMoviesByGenres();
  }

  loadMovies() {
    this.loading = true;
    this.movieService.getPopularMovies(this.currentPage).subscribe({
      next: (response) => {
        if (this.currentPage === 1) {
          this.movies = response.results;
          this.featuredMovies = response.results.slice(0, 5);
        } else {
          this.movies = [...this.movies, ...response.results];
        }
        this.totalPages = response.total_pages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar filmes:', error);
        this.loading = false;
      }
    });
  }

  onSearchChange(event: any) {
    const query = event.detail.value;
    this.searchQuery = query;
    
    if (query && query.length > 2) {
      this.loading = true;
      this.movieService.searchMovies(query).subscribe({
        next: (response) => {
          this.movies = response.results;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro na busca:', error);
          this.loading = false;
        }
      });
    } else if (!query) {
      this.currentPage = 1;
      this.loadMovies();
    }
  }

  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie-details', movieId]);
  }

  toggleFavorite(movie: Movie, event: Event) {
    event.stopPropagation();
    this.favoritesService.toggleFavorite(movie);
  }

  isFavorite(movieId: number): boolean {
    return this.favoritesService.isFavorite(movieId);
  }

  goToFavorites() {
    this.router.navigate(['/favorites']);
  }

  goToProfile() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadMore(event: any) {
    if (this.currentPage < this.totalPages && !this.searchQuery) {
      this.currentPage++;
      this.movieService.getPopularMovies(this.currentPage).subscribe({
        next: (response) => {
          this.movies = [...this.movies, ...response.results];
          event.target.complete();
          
          if (this.currentPage >= this.totalPages) {
            event.target.disabled = true;
          }
        },
        error: () => {
          event.target.complete();
        }
      });
    } else {
      event.target.complete();
    }
  }

  loadTrendingMovies() {
    this.movieService.getTrendingMovies().subscribe({
      next: (response) => {
        this.trendingMovies = response.results.slice(0, 10);
      },
      error: (error) => {
        console.error('Erro ao carregar filmes em alta:', error);
      }
    });
  }

  loadTopRatedMovies() {
    this.movieService.getTopRatedMovies(1).subscribe({
      next: (response) => {
        this.topRatedMovies = response.results.slice(0, 10);
      },
      error: (error) => {
        console.error('Erro ao carregar filmes mais bem avaliados:', error);
      }
    });
  }

  loadContinueWatching() {
    this.favoritesService.favorites$.subscribe(favorites => {
      this.continueWatching = favorites.slice(0, 10);
    });
  }

  loadMoviesByGenres() {
    this.movieService.getMoviesByGenre(28, 1).subscribe({
      next: (response) => {
        this.actionMovies = response.results.slice(0, 10);
      },
      error: (error) => {
        console.error('Erro ao carregar filmes de ação:', error);
      }
    });

    this.movieService.getMoviesByGenre(35, 1).subscribe({
      next: (response) => {
        this.comedyMovies = response.results.slice(0, 10);
      },
      error: (error) => {
        console.error('Erro ao carregar filmes de comédia:', error);
      }
    });

    this.movieService.getMoviesByGenre(18, 1).subscribe({
      next: (response) => {
        this.dramaMovies = response.results.slice(0, 10);
      },
      error: (error) => {
        console.error('Erro ao carregar filmes de drama:', error);
      }
    });

    this.movieService.getMoviesByGenre(27, 1).subscribe({
      next: (response) => {
        this.horrorMovies = response.results.slice(0, 10);
      },
      error: (error) => {
        console.error('Erro ao carregar filmes de terror:', error);
      }
    });
  }
}
