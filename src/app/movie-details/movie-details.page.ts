import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonBackButton, 
  IonButtons,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
  IonChip,
  IonLabel,
  IonItem,
  IonAvatar,
  IonSpinner,
  IonIcon
} from '@ionic/angular/standalone';
import { MovieService, MovieDetails, Movie } from '../services/movie.service';
import { FavoritesService } from '../services/favorites.service';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { DatePipe } from '@angular/common';
import { HighlightDirective } from '../directives/highlight.directive';
import { addIcons } from 'ionicons';
import { heart, heartOutline, caretForward, person } from 'ionicons/icons';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonImg,
    IonChip,
    IonLabel,
    IonItem,
  IonAvatar,
  IonSpinner,
  IonIcon,
  IonButton,
  TruncatePipe,
  DatePipe,
  HighlightDirective
  ]
})
export class MovieDetailsPage implements OnInit {
  movie: MovieDetails | null = null;
  loading = true;
  movieId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
    private favoritesService: FavoritesService
  ) {
    addIcons({ heart, heartOutline, caretForward, person });
  }

  ngOnInit() {
    // Recebendo parâmetro da rota (PONTO EXTRA)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.movieId = +id;
        this.loadMovieDetails();
      }
    });
  }

  loadMovieDetails() {
    if (this.movieId) {
      this.loading = true;
      this.movieService.getMovieDetails(this.movieId).subscribe({
        next: (data) => {
          this.movie = {
            ...data,
            cast: data.credits?.cast?.slice(0, 10) || []
          };
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar filme:', error);
          this.loading = false;
        }
      });
    }
  }

  toggleFavorite() {
    if (this.movie) {
      const movieData: Movie = {
        id: this.movie.id,
        title: this.movie.title,
        overview: this.movie.overview,
        poster_path: this.movie.poster_path,
        release_date: this.movie.release_date,
        vote_average: this.movie.vote_average,
        backdrop_path: this.movie.backdrop_path
      };
      this.favoritesService.toggleFavorite(movieData);
    }
  }

  isFavorite(): boolean {
    return this.movie ? this.favoritesService.isFavorite(this.movie.id) : false;
  }
}


