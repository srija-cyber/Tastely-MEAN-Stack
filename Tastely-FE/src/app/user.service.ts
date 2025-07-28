import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  savedRecipes?: string[];
  likedRecipes?: string[]; 
  createdAt: Date;
  updatedAt: Date;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private http:HttpClient) {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  private apiUrl = 'http://localhost:3000'; 

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    const user: User = {
      id: 'user-' + Math.random().toString(36).substring(2, 9),
      email: email,
      fullName: email.split('@')[0], // Default name from email
      savedRecipes: [],
      likedRecipes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    
    return of(user);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  updateProfile(updates: Partial<User>): Observable<User> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      throw new Error('No user logged in');
    }
    const updatedUser = { ...currentUser, ...updates, updatedAt: new Date() };
    this.currentUserSubject.next(updatedUser);
    return of(updatedUser);
  }

  saveRecipe(recipeId: string): Observable<User> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      throw new Error('No user logged in');
    }
    
    const savedRecipes = [...(currentUser.savedRecipes || [])];
    if (!savedRecipes.includes(recipeId)) {
      savedRecipes.push(recipeId);
    }
    
    const updatedUser = { 
      ...currentUser, 
      savedRecipes,
      updatedAt: new Date() 
    };
    this.currentUserSubject.next(updatedUser);
    return of(updatedUser);
  }

  unsaveRecipe(recipeId: string): Observable<User> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      throw new Error('No user logged in');
    }
    
    const savedRecipes = (currentUser.savedRecipes || []).filter(id => id !== recipeId);
    const updatedUser = { 
      ...currentUser, 
      savedRecipes,
      updatedAt: new Date() 
    };
    this.currentUserSubject.next(updatedUser);
    return of(updatedUser);
  }

  likeRecipe(recipeId: string): Observable<User> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      throw new Error('No user logged in');
    }
    
    const likedRecipes = [...(currentUser.likedRecipes || [])];
    if (!likedRecipes.includes(recipeId)) {
      likedRecipes.push(recipeId);
    }
    
    const updatedUser = { 
      ...currentUser, 
      likedRecipes,
      updatedAt: new Date() 
    };
    this.currentUserSubject.next(updatedUser);
    return of(updatedUser);
  }

  unlikeRecipe(recipeId: string): Observable<User> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      throw new Error('No user logged in');
    }
    
    const likedRecipes = (currentUser.likedRecipes || []).filter(id => id !== recipeId);
    const updatedUser = { 
      ...currentUser, 
      likedRecipes,
      updatedAt: new Date() 
    };
    this.currentUserSubject.next(updatedUser);
    return of(updatedUser);
  }

    getUserStats(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}/stats`);
  }

  uploadAvatar(userId: string, imageData: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/users/${userId}/avatar`, { imageData });
  }

  getSavedRecipes(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${userId}/saved-recipes`);
  }

  
  updateUserProfile(userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userData.id}`, userData);
  }

  updateUserAvatar(userId: string, avatarFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    return this.http.patch(`${this.apiUrl}/${userId}/avatar`, formData);
  }

    isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
}