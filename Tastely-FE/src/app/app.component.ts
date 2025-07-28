import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

interface User {
  userName: string;
  email: string;
  password: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Smart Recipe Generator';
  hideNavbar = false;
  isLoggedIn = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkAuthStatus(); 
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const routeData = this.router.routerState.snapshot.root.firstChild?.data;
      this.hideNavbar = routeData?.['hideNavbar'] || false;

      if (isPlatformBrowser(this.platformId)) {
        this.checkAuthStatus(); 
      }
    });
  }

  private checkAuthStatus(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const userData = localStorage.getItem('signUpUsers');
        this.isLoggedIn = userData 
          ? (JSON.parse(userData) as User[]).some(user => user.isActive)
          : false;
      } catch (e) {
        console.error('Error reading auth status:', e);
        this.isLoggedIn = false;
      }
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const userData = localStorage.getItem('signUpUsers');
        if (userData) {
          const users = JSON.parse(userData) as User[];
          const updatedUsers = users.map(user => ({ ...user, isActive: false }));
          localStorage.setItem('signUpUsers', JSON.stringify(updatedUsers));
        }
      } catch (e) {
        console.error('Error during logout:', e);
      }
    }
    
    this.isLoggedIn = false;
    this.router.navigate(['/user-login']);
  }



}