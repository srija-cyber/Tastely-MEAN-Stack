import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

// Components
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { ShareModalComponent } from '../../components/share-modal/share-modal.component';
import { FooterComponent } from '../footer/footer.component';
// Services
import { RecipeService } from '../../recipe.service';
import { FavoritesService } from '../../favorites.service';
import { Recipe } from '../../../recipe-model';
import { NewrecipeService } from '../../newrecipe.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RecipeCardComponent,
    ShareModalComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // Filter options
  // Filter options
  availableIngredients: string[] = [
    'Tomato', 'Onion', 'Rice', 'Paneer',
    'Chicken', 'Garlic', 'Cabbage', 'Lettuce'
  ];

  cuisines: string[] = [
    'All', 'Indian', 'Italian', 'Chinese',
    'Greek', 'Mexican', 'American', 'Turkish', 'Japanese', 'Thai'
  ];

  dietTypes: string[] = [
    'Vegetarian', 'Vegan', 'Non-Vegetarian',
    'Ovo-vegetarian'
  ];

  // Filter state
  selectedIngredients: string[] = [];
  selectedCuisine: string = 'All';
  selectedDietType: string = '';
  dishQuery: string = '';
  filterRecipes!: any[];
  // Data
  recipes: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  // Modal state
  showShareModal: boolean = false;
  recipeToShare: Recipe | null = null;

  constructor(
    private favoritesService: FavoritesService,
    private router: Router,
    private newRecipeService: NewrecipeService,
    private cd: ChangeDetectorRef
  ) {
    this.loadChatbotScript()
    this.fetchRecipes(); // Initialize with all recipes
  }

  public fetchRecipes(): void {

    this.isLoading = true;
    this.error = null;

    const filters = {
      ingredients: this.selectedIngredients,
      cuisine: this.selectedCuisine,
      query: this.dishQuery,
      dietType: this.selectedDietType
    };
    console.log("fetchRecipes called");

    this.newRecipeService.getRecipes(filters).subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.filterRecipes = recipes; // Store the original recipes for filtering
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load recipes. Please try again.';
        console.error('Error fetching recipes:', err);
        this.isLoading = false;
      }
    });
  }

  // Filter handlers
  toggleIngredient(ingredient: string): void {
    this.selectedIngredients = this.selectedIngredients.includes(ingredient)
      ? this.selectedIngredients.filter(i => i !== ingredient)
      : [...this.selectedIngredients, ingredient];
    this.fetchRecipes();
  }

  selectCuisine(cuisine: string): void {
    console.log(this.filterRecipes);
    this.recipes = this.filterRecipes.filter((recipe: any) => {
      return recipe.cuisine.toLowerCase() === cuisine.toLowerCase();
    })
    this.cd.detectChanges()
  }

  selectDietType(dietType: string): void {
    this.selectedDietType = dietType;
    this.fetchRecipes();
  }

  onDishSearch(): void {
    this.fetchRecipes();
  }

  resetFilters(): void {
    this.selectedIngredients = [];
    this.selectedCuisine = 'All';
    this.selectedDietType = '';
    this.dishQuery = '';
    this.fetchRecipes();
  }

  // Recipe actions
  toggleFavorite(id: string): void {
    // Implement actual favorite toggle logic using FavoritesService
    this.favoritesService.toggleFavorite('currentUserId', id).subscribe({
      next: () => console.log('Favorite toggled successfully'),
      error: err => console.error('Error toggling favorite:', err)
    });
  }

  isFavorite(id: string): boolean {
    // Implement actual favorite check
    return false; // Temporary
  }

  goToDetails(id: string): void {
    this.router.navigate(['/recipe', id]);
  }

  // Modal handlers
  openShareModal(recipe: Recipe): void {
    this.recipeToShare = recipe;
    this.showShareModal = true;
  }

  closeShareModal(): void {
    this.showShareModal = false;
    this.recipeToShare = null;
  }


  clearDietType(): void {
    this.selectedDietType = '';
    this.fetchRecipes();
  }


  private loadChatbotScript(): void {
    if (document.getElementById('jotform-chatbot-script')) return;

    const script = document.createElement('script');
    script.id = 'jotform-chatbot-script';
    script.src = 'https://cdn.jotfor.ms/agent/embedjs/0197c44a66f4772f8e18523610d519d12e6f/embed.js?skipWelcome=1&maximizable=1';
    script.async = true;
    script.onerror = () => console.error('Failed to load chatbot script');

    document.body.appendChild(script);
  }

}