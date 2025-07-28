import { Component, EventEmitter, inject, Input } from '@angular/core';
import { Output } from '@angular/core';
import { FavoritesService } from '../../favorites.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { NewrecipeService } from '../../newrecipe.service';
import { HomeComponent } from '../../pages/home/home.component';
@Component({
  selector: 'app-recipe-card',
  imports: [FormsModule, CommonModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {



  @Input() recipe: any;
  @Input() isFavorite: boolean = false; // This input must exist
  @Input() userId: string = '';
  @Output() viewDetails = new EventEmitter<string>();
  @Output() toggleFavorite = new EventEmitter<string>();
  @Output() shareRecipe = new EventEmitter<string>();
  @Output() favoriteToggled = new EventEmitter<void>(); // ✅ emits when favorite toggled
  parent = inject(HomeComponent)


  constructor(private favoritesService: FavoritesService, private router: Router, private newRecipeService: NewrecipeService) { }
  user: any;
  ngOnInit() {    
    this.user = JSON.parse(localStorage.getItem('user') || '{}');

  }

 onToggleFavorite(recipeId: string): void {
    console.log('Toggling favorite for recipe:', recipeId);
    console.log('Current user ID:', this.user.id);

    this.newRecipeService.likeRecipe(recipeId, this.user.id).subscribe(() => {
      this.parent.fetchRecipes(); // ✅ Notify parent to fetch recipes again
      console.log('value emitted');
    });
  }

  onShare() {
    this.shareRecipe.emit(this.recipe.id);
  }

  onViewDetails(id: string) {
    this.router.navigate(['/recipe', id])
  }
}

