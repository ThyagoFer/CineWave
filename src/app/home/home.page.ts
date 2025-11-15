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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
  IonButton,
  IonButtons,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartOutline, caretForward, informationCircle, playCircle } from 'ionicons/icons';
import { MovieService, Movie } from '../services/movie.service';
import { FavoritesService } from '../services/favorites.service';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { DatePipe } from '@angular/common';
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
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonImg,
    IonButton,
    IonSpinner,
    IonGrid,
    IonRow,
    IonCol,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonIcon,
  IonButtons,
  TruncatePipe,
  DatePipe,
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
    public favoritesService: FavoritesService
  ) {
    addIcons({ heart, heartOutline, caretForward, informationCircle, playCircle });
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
          // Primeiros 5 filmes para o carrossel
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
    // Passando parâmetro por rota (PONTO EXTRA)
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
    // Usa os favoritos como "Continue Watching"
    this.favoritesService.favorites$.subscribe(favorites => {
      this.continueWatching = favorites.slice(0, 10);
    });
  }

  loadMoviesByGenres() {
    // Ação (28)
    this.movieService.getMoviesByGenre(28, 1).subscribe({
      next: (response) => {
        this.actionMovies = response.results.slice(0, 10);
      },
      error: (error) => {
        console.error('Erro ao carregar filmes de ação:', error);
      }
    });

    // Comédia (35)
    this.movieService.getMoviesByGenre(35, 1).subscribe({
      next: (response) => {
        this.comedyMovies = response.results.slice(0, 10);
      },
      error: (error) => {
        console.error('Erro ao carregar filmes de comédia:', error);
      }
    });

    // Drama (18)
    this.movieService.getMoviesByGenre(18, 1).subscribe({
      next: (response) => {
        this.dramaMovies = response.results.slice(0, 10);
      },
      error: (error) => {
        console.error('Erro ao carregar filmes de drama:', error);
      }
    });

    // Terror (27)
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
