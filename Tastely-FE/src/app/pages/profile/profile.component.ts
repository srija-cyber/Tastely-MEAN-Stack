import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';

interface User {
  _id?: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate?: Date;
}

interface UserStats {
  recipesCount: number;
  followersCount: number;
  followingCount: number;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user:any;
  
  userStats: UserStats = {
    recipesCount: 0,
    followersCount: 0,
    followingCount: 0
  };
  
  showAvatarModal = false;
  selectedImage: string | null = null;
  selectedFile: File | null = null;
  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = [JSON.parse(localStorage.getItem('user') || 'null') ];
    console.log(this.user);
    
    this.isLoggedIn = this.authService.isAuthenticated();
    if (!this.isLoggedIn) {
      this.router.navigate(['/user-login']);
      return;
    }
    this.loadUserStats();
  }

  private loadUserStats(): void {
    // For now, using mock data since we don't have stats endpoints
    this.userStats = {
      recipesCount: 0,
      followersCount: 0,
      followingCount: 0
    };
    
    // In a real app, you would call:
    // this.authService.getUserStats().subscribe(...);
  }

  openAvatarUpload(): void {
    this.showAvatarModal = true;
  }

  closeAvatarUpload(): void {
    this.showAvatarModal = false;
    this.selectedImage = null;
    this.selectedFile = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      // Basic validation - check file size (max 2MB) and type
      if (this.selectedFile.size > 2 * 1024 * 1024) {
        alert('File size should be less than 2MB');
        return;
      }
      
      if (!this.selectedFile.type.match('image.*')) {
        alert('Only image files are allowed');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.selectedImage = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadAvatar(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('avatar', this.selectedFile);

      this.authService.uploadAvatar(formData).subscribe({
        next: (updatedUser) => {
          this.user.avatar = updatedUser.avatar;
          this.closeAvatarUpload();
        },
        error: (err) => {
          console.error('Error uploading avatar:', err);
          alert('Failed to upload avatar. Please try again.');
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/user-login']);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}