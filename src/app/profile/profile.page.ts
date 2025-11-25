import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonInput,
  IonTextarea,
  IonIcon,
  IonSpinner
} from '@ionic/angular/standalone';
import { AuthService, User } from '../services/auth.service';
import { FavoritesService } from '../services/favorites.service';
import { addIcons } from 'ionicons';
import { 
  person, 
  mail, 
  call, 
  create, 
  checkmark, 
  close, 
  logOut, 
  camera,
  home,
  arrowBack,
  heart
} from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonInput,
    IonTextarea,
    IonIcon,
    IonSpinner
  ]
})
export class ProfilePage implements OnInit {
  user: User | null = null;
  isEditing = false;
  loading = false;
  successMessage = '';
  errorMessage = '';
  editName = '';
  editPhone = '';
  editBio = '';
  editAvatar = '';

  avatarOptions = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia'
  ];
  showAvatarSelector = false;
  favoritesCount = 0;

  constructor(
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {
    addIcons({ person, mail, call, create, checkmark, close, logOut, camera, home, arrowBack, heart });
  }

  ngOnInit() {
    this.loadUser();
    
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.resetEditFields();
      }
    });

    this.favoritesService.favorites$.subscribe(favorites => {
      this.favoritesCount = favorites.length;
    });
  }

  loadUser() {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
    this.resetEditFields();
  }

  resetEditFields() {
    if (this.user) {
      this.editName = this.user.name;
      this.editPhone = this.user.phone || '';
      this.editBio = this.user.bio || '';
      this.editAvatar = this.user.avatar || this.avatarOptions[0];
    }
  }

  startEditing() {
    this.isEditing = true;
    this.clearMessages();
  }

  cancelEditing() {
    this.isEditing = false;
    this.resetEditFields();
    this.clearMessages();
  }

  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  async saveChanges() {
    if (!this.editName.trim()) {
      this.errorMessage = 'O nome não pode estar vazio.';
      return;
    }

    this.loading = true;
    this.clearMessages();
    await new Promise(resolve => setTimeout(resolve, 600));

    const result = this.authService.updateProfile({
      name: this.editName.trim(),
      phone: this.editPhone.trim(),
      bio: this.editBio.trim(),
      avatar: this.editAvatar
    });

    if (result.success) {
      this.successMessage = result.message;
      this.isEditing = false;
    } else {
      this.errorMessage = result.message;
    }

    this.loading = false;
  }

  selectAvatar(avatar: string) {
    this.editAvatar = avatar;
    this.showAvatarSelector = false;
  }

  toggleAvatarSelector() {
    this.showAvatarSelector = !this.showAvatarSelector;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToFavorites() {
    this.router.navigate(['/favorites']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  getCurrentAvatar(): string {
    if (this.isEditing) {
      return this.editAvatar || this.avatarOptions[0];
    }
    return this.user?.avatar || this.avatarOptions[0];
  }

  getInitials(): string {
    if (!this.user?.name) return '?';
    const names = this.user.name.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[names.length - 1][0];
    }
    return names[0][0];
  }
}
