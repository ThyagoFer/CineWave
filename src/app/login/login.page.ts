import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonInput,
  IonIcon,
  IonSpinner
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { FavoritesService } from '../services/favorites.service';
import { addIcons } from 'ionicons';
import { mail, lockClosed, person, eye, eyeOff, film } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonInput,
    IonIcon,
    IonSpinner
  ]
})
export class LoginPage {
  isLoginMode = true;
  email = '';
  password = '';
  confirmPassword = '';
  name = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {
    addIcons({ mail, lockClosed, person, eye, eyeOff, film });
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.clearMessages();
    this.clearForm();
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  clearForm(): void {
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.name = '';
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateForm(): boolean {
    this.clearMessages();

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return false;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Por favor, insira um e-mail válido.';
      return false;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      return false;
    }

    if (!this.isLoginMode) {
      if (!this.name) {
        this.errorMessage = 'Por favor, insira seu nome.';
        return false;
      }

      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'As senhas não coincidem.';
        return false;
      }
    }

    return true;
  }

  async onSubmit(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    await new Promise(resolve => setTimeout(resolve, 800));

    if (this.isLoginMode) {
      const result = this.authService.login(this.email, this.password);
      
      if (result.success) {
        this.successMessage = result.message;
        this.favoritesService.migrateGuestFavorites();
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 500);
      } else {
        this.errorMessage = result.message;
      }
    } else {
      const result = this.authService.register(this.email, this.password, this.name);
      
      if (result.success) {
        this.successMessage = result.message;
        this.favoritesService.migrateGuestFavorites();
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 500);
      } else {
        this.errorMessage = result.message;
      }
    }

    this.loading = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  continueAsGuest(): void {
    this.router.navigate(['/home']);
  }
}
