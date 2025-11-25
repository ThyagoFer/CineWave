import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'cinewave_users';
  private readonly CURRENT_USER_KEY = 'cinewave_current_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {}

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getUsers(): { [email: string]: { user: User; password: string } } {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : {};
  }

  private saveUsers(users: { [email: string]: { user: User; password: string } }): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  register(email: string, password: string, name: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();

    if (users[email]) {
      return { success: false, message: 'Este e-mail já está cadastrado.' };
    }

    const newUser: User = {
      id: this.generateId(),
      email,
      name,
      createdAt: new Date().toISOString()
    };

    users[email] = { user: newUser, password };
    this.saveUsers(users);
    this.setCurrentUser(newUser);

    return { success: true, message: 'Conta criada com sucesso!', user: newUser };
  }

  login(email: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const userData = users[email];

    if (!userData) {
      return { success: false, message: 'E-mail não encontrado.' };
    }

    if (userData.password !== password) {
      return { success: false, message: 'Senha incorreta.' };
    }

    this.setCurrentUser(userData.user);
    return { success: true, message: 'Login realizado com sucesso!', user: userData.user };
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.currentUserSubject.next(null);
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  updateProfile(updatedData: Partial<User>): { success: boolean; message: string; user?: User } {
    const currentUser = this.getCurrentUser();
    
    if (!currentUser) {
      return { success: false, message: 'Usuário não está logado.' };
    }

    const users = this.getUsers();
    const userData = users[currentUser.email];

    if (!userData) {
      return { success: false, message: 'Usuário não encontrado.' };
    }

    const updatedUser: User = {
      ...userData.user,
      ...updatedData,
      id: userData.user.id,
      email: userData.user.email,
      createdAt: userData.user.createdAt
    };

    users[currentUser.email] = { user: updatedUser, password: userData.password };
    this.saveUsers(users);
    this.setCurrentUser(updatedUser);

    return { success: true, message: 'Perfil atualizado com sucesso!', user: updatedUser };
  }

  changePassword(currentPassword: string, newPassword: string): { success: boolean; message: string } {
    const currentUser = this.getCurrentUser();
    
    if (!currentUser) {
      return { success: false, message: 'Usuário não está logado.' };
    }

    const users = this.getUsers();
    const userData = users[currentUser.email];

    if (!userData) {
      return { success: false, message: 'Usuário não encontrado.' };
    }

    if (userData.password !== currentPassword) {
      return { success: false, message: 'Senha atual incorreta.' };
    }

    users[currentUser.email] = { user: userData.user, password: newPassword };
    this.saveUsers(users);

    return { success: true, message: 'Senha alterada com sucesso!' };
  }
}
