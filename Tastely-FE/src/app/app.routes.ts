import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';
import { UserDishesComponent } from './components/user-dishes/user-dishes.component';
import { AuthGuard } from './auth.guard';
import { UserLoginComponent } from './pages/user-login/user-login.component';
import { SubmitIdeaComponent } from './components/submit-idea/submit-idea.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { BlogListComponent } from './pages/blog-list/blog-list.component';
import { BlogDetailComponent } from './pages/blog-detail/blog-detail.component';
import { FaqsComponent } from './pages/faqs/faqs.component';

export const routes: Routes = [
  { path: 'user-login', component: UserLoginComponent,data: { hideNavbar: true } },
  { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'userdishes', component: UserDishesComponent, canActivate: [AuthGuard] },
  { path: 'recipe/:id', component: RecipeDetailComponent, canActivate: [AuthGuard] },
  { path: 'submit-dishes/:id', component:SubmitIdeaComponent, canActivate: [AuthGuard] },
  {path: 'dashboard', component:DashboardComponent, canActivate: [AuthGuard]},
  {path: 'profile', component:ProfileComponent, canActivate:[AuthGuard]},
  { path: 'blogs', component: BlogListComponent,canActivate: [AuthGuard] },
  { path: 'blogDetail/:id', component: BlogDetailComponent, canActivate: [AuthGuard]},
  { path: 'faqs', component: FaqsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'user-login' }
];

