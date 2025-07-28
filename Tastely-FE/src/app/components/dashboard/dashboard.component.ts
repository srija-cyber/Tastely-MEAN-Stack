import { Component, OnInit } from '@angular/core';
import { SubmitrecipeService } from '../../submitrecipe.service';
import { UserService } from '../../user.service';
import { Recipe } from '../../../recipe-model';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NewrecipeService } from '../../newrecipe.service';
import { FooterComponent } from '../../pages/footer/footer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, FooterComponent,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any;
  favoriteRecipes: any[] = [];
  postedRecipes: any = [];
  isLoading = true;
  leaderboard = [
    { rank: 1, name: 'Chef Marco', points: 2450 },
    { rank: 2, name: 'Chef Sarah', points: 2180 },
    { rank: 3, name: 'Chef Alex', points: 1920 }
  ];
  activities = [
    { time: '2 hours ago', message: 'You liked <strong>Butter Paneer</strong>' },
    { time: '5 hours ago', message: '<strong>3 people</strong> commented on your <strong>Mango Lassi</strong>' },
    { time: '1 day ago', message: 'Leaderboard rank <strong>+2</strong> 📈' },
    { time: '2 days ago', message: 'Your <strong>Homemade Pizza</strong> got 5 new likes' }
  ];
  stats = {
    totalRecipes: 2847,
    popularCuisine: 'Italian',
    mostLikedToday: 'Chocolate Cake'
  };

  constructor(
    private recipeService: SubmitrecipeService,
    private userService: UserService,
    private router: Router,
    private newrecipeService: NewrecipeService
  ) { }

  ngOnInit(): void {
    this.user = [JSON.parse(localStorage.getItem('user') || 'null')];
    this.getLikedRecipesCount();
    this.loadData();

    console.log(this.postedRecipes)
  }

  loadData(): void {
    this.isLoading = true;

    // Get user's posted recipes
    this.newrecipeService.getRecipesByAuthor(this.user[0].id).subscribe({
      next: (recipes) => {
        this.postedRecipes = recipes;
        console.log('Posted Recipes:', this.postedRecipes);

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching recipes:', err);
        this.isLoading = false;
      }
    });

    // Get user's favorite recipes
    this.recipeService.getAllRecipes().subscribe({
      next: (allRecipes) => {
        this.favoriteRecipes = allRecipes.filter(recipe =>
          recipe.liked_by?.includes(this.user.email)
        );
      },
      error: (err) => {
        console.error('Error fetching all recipes:', err);
      }
    });
  }

  getEmojiForCuisine(cuisine: string): string {
    const emojiMap: Record<string, string> = {
      'Italian': '🍝',
      'Indian': '🍛',
      'Chinese': '🥡',
      'Japanese': '🍣',
      'Mexican': '🌮',
      'Thai': '🍲',
      'American': '🍔',
      'French': '🥐',
      'Beverage': '🥤',
      'Dessert': '🍰'
    };
    return emojiMap[cuisine] || '🍴';
  }

  deleteRecipe(recipeId: string): void {
    console.log('Deleting recipe with ID:', recipeId);

    this.newrecipeService.deleteRecipe(recipeId).subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => {
        console.error('Error deleting recipe:', err);
        // Optionally show an error message
      }
    });
  }


  unlikeRecipe(recipeId: string): void {
    this.recipeService.unlikeRecipe(recipeId, this.user.email).subscribe({
      next: () => {
        this.favoriteRecipes = this.favoriteRecipes.filter(r => r.id !== recipeId);
      },
      error: (err) => {
        console.error('Error unliking recipe:', err);
      }
    });
  }

  shareRecipe(recipe: Recipe): void {
    const shareText = `Check out this recipe: ${recipe.name}`;
    if (navigator.share) {
      navigator.share({
        title: recipe.name,
        text: shareText,
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support Web Share API
      console.log(shareText);
      // Or implement a custom share modal
    }
  }

 

  getLikedRecipesCount() {
    this.newrecipeService.getLikedRecipesByUser(this.user[0].id).subscribe({
      next: (likedRecipes) => {
        console.log('Liked Recipes Count:', likedRecipes.length);
        this.favoriteRecipes = likedRecipes;
      },
      error: (err) => {
        console.error('Error fetching liked recipes:', err);
      }
    });
  }

  viewRecipe(id: string): void {
    console.log('id : ',id);
    this.router.navigate(['/recipe', id]);
  }

   onToggleFavorite(recipeId: string): void {

    this.newrecipeService.likeRecipe(recipeId, this.user[0].id).subscribe(() => {
      this.getLikedRecipesCount(); 
    });
  }

}