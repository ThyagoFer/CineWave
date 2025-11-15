import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  backdrop_path?: string;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  cast: CastMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface ApiResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiKey = '9f8bbdcea0017ef0396c9ac2581899d8';
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {}

  // Método GET para buscar filmes populares
  getPopularMovies(page: number = 1): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&page=${page}&language=pt-BR`
    );
  }

  // Método GET para buscar detalhes do filme
  getMovieDetails(movieId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}&language=pt-BR&append_to_response=credits`
    );
  }

  // Método GET para buscar filmes por busca
  searchMovies(query: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${query}&language=pt-BR`
    );
  }

  // Método GET para buscar filmes em alta/trending
  getTrendingMovies(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.baseUrl}/trending/movie/week?api_key=${this.apiKey}&language=pt-BR`
    );
  }

  // Método GET para buscar filmes mais bem avaliados
  getTopRatedMovies(page: number = 1): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.baseUrl}/movie/top_rated?api_key=${this.apiKey}&page=${page}&language=pt-BR`
    );
  }

  // Método GET para buscar filmes por gênero
  getMoviesByGenre(genreId: number, page: number = 1): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}&page=${page}&language=pt-BR&sort_by=popularity.desc`
    );
  }
}





