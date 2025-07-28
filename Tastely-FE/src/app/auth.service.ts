import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

interface User {
  _id?: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate?: Date;
}

interface AuthResponse {
  accessToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  private readonly API_URL = 'http://localhost:5000/api';
  private readonly TOKEN_KEY = 'auth_token';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const initialUser = this.isBrowser ?
      JSON.parse(localStorage.getItem('currentUser') || 'null') :
      null;
    this.currentUserSubject = new BehaviorSubject<User | null>(initialUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  signUp(user: User): Observable<User> { 
    return this.http.post<User>(`${this.API_URL}/auth/register`, user)

  }

  signIn(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, { email, password })
  }

  logout(): void {
    this.clearAuthState();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.TOKEN_KEY) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setAuthState(token: string, user: User): void {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  private clearAuthState(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<User[]>(
      `${this.API_URL}/users?email=${encodeURIComponent(email)}`
    ).pipe(
      map(users => users.length > 0)
    );
  }

  getCurrentUser(): Observable<User> {
  return this.http.get<User>(`${this.API_URL}/users/me`, {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    })
  });
}

uploadAvatar(formData: FormData): Observable<User> {
  return this.http.post<User>(`${this.API_URL}/users/avatar`, formData, {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    })
  });
}
}