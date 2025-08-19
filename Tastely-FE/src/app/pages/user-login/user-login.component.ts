import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

interface User {
  userName: string;
  email: string;
  password: string;
  isActive?: boolean;
  joinDate?: Date;
  avatar?: string;
}

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  signUpUsers: User[] = [];
  signUpObj: User = {
    userName: '',
    email: '',
    password: ''
  };
  loginObj = {
    email: '',
    password: ''
  };

  successMessage: string = '';
  errorMessage: string = '';


  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    if (typeof localStorage !== 'undefined') {
      const localData = localStorage.getItem('signUpUsers');
      this.signUpUsers = localData ? JSON.parse(localData) : [];
    }
  }

  onSignUp(): void {
    const reqBody: any =
    {
      email: this.signUpObj.email,
      password: this.signUpObj.password,
      name: this.signUpObj.userName
    }

    this.authService.signUp(reqBody).subscribe({
      next: (res) => {
        console.log(res);
        this.successMessage = 'Sign Up successful! Please Sign In.';
        this.errorMessage = '';
        this.clearSignUpForm();
        this.switchToLogin();
      }
      , error: (err) => {
        console.error(err);
      }
    })
  }

  onLoginIn(): void {
    const reqBody = {
      email: this.loginObj.email,
      password: this.loginObj.password
    };

    this.authService.signIn(reqBody.email, reqBody.password).subscribe({
      next: (res: any) => {
        console.log(res);
        localStorage.setItem('auth_token', res.accessToken);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['/']);
        this.successMessage = 'Successfully signed in!';
        this.errorMessage = '';
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Login failed. Invalid email or password.';
        this.successMessage = '';
      }
    });

  }

  toggleForms(): void {
    const container = document.getElementById('container');
    container?.classList.toggle("right-panel-active");
  }

  switchToLogin(): void {
    const container = document.getElementById('container');
    container?.classList.remove("right-panel-active");
  }

  clearSignUpForm(): void {
    this.signUpObj = {
      userName: '',
      email: '',
      password: ''
    };
    
  }

}