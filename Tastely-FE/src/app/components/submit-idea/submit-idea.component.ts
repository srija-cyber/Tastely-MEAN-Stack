import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecipeService } from '../../recipe.service';
import { UserService } from '../../user.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs';
import { SubmitrecipeService } from '../../submitrecipe.service';
import { NewrecipeService } from '../../newrecipe.service';
import { FooterComponent } from '../../pages/footer/footer.component';

interface Cuisine {
  id: string;
  name: string;
}

interface DietType {
  id: string;
  name: string;
}

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  category: string;
}

// interface Recipe {
//   id?: string;
//   name: string;
//   cuisine: string;
//   dietType: string;
//   prepTime: number;
//   cookTime: number;
//   servings: number;
//   difficulty: string;
//   ingredients: Ingredient[];
//   instructions: string[];
//   imageUrl?: string;
//   tags: string[];
//   author_email: string;
//   author_name: string;
//   likes?: number;
//   liked_by?: string[];
//   createdAt?: Date;
//   updatedAt?: Date;
// }

@Component({
  selector: 'app-submit-idea',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule, FooterComponent],
  templateUrl: './submit-idea.component.html',
  styleUrls: ['./submit-idea.component.css']
})
export class SubmitIdeaComponent implements OnInit {
  recipeForm!: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  success = true;
  ingredientCategories = ['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Seafood', 'Grains', 'Spices', 'Other'];

  cuisines: Cuisine[] = [
    { id: "italian", name: "Italian" },
    { id: "french", name: "French" },
    { id: "chinese", name: "Chinese" },
    { id: "japanese", name: "Japanese" },
    { id: "indian", name: "Indian" },
    { id: "mexican", name: "Mexican" },
    { id: "thai", name: "Thai" },
    { id: "mediterranean", name: "Mediterranean" },
    { id: "american", name: "American" },
    { id: "middle_eastern", name: "Middle Eastern" },
    { id: "korean", name: "Korean" },
    { id: "vietnamese", name: "Vietnamese" },
    { id: "greek", name: "Greek" },
    { id: "spanish", name: "Spanish" },
    { id: "moroccan", name: "Moroccan" },
    { id: "other", name: "Other" }
  ];

  dietTypes: DietType[] = [
    { id: "omnivore", name: "Omnivore" },
    { id: "vegetarian", name: "Vegetarian" },
    { id: "vegan", name: "Vegan" },
    { id: "gluten_free", name: "Gluten Free" },
    { id: "keto", name: "Keto" },
    { id: "paleo", name: "Paleo" },
    { id: "dairy_free", name: "Dairy Free" },
    { id: "low_carb", name: "Low Carb" },
    { id: "pescatarian", name: "Pescatarian" }
  ];

  difficulties = [
    { id: "easy", name: "Easy" },
    { id: "medium", name: "Medium" },
    { id: "hard", name: "Hard" }
  ];

  recipeId: any;
  user: any;
  constructor(
    private fb: FormBuilder,
    private recipeService: SubmitrecipeService,
    private userService: UserService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private newRecipeService: NewrecipeService,
  ) { }

  ngOnInit(): void {
    this.user = [JSON.parse(localStorage.getItem('user') || 'null')];
    this.recipeId = this.aRoute.snapshot.paramMap.get('id');
    if (this.recipeId) {
      this.getRecipeById();
    } 
    this.initializeForm();
  }

  initializeForm(): void {
    this.recipeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      cuisine: ['italian', Validators.required],
      dietType: ['omnivore', Validators.required],
      prepTime: ['', [Validators.required, Validators.min(0)]],
      cookTime: ['', [Validators.required, Validators.min(0)]],
      servings: ['1', [Validators.required, Validators.min(1)]],
      difficulty: ['easy', Validators.required],
      ingredients: this.fb.array([this.createIngredientGroup()], Validators.required),
      instructions: this.fb.array([this.createInstructionControl()], Validators.required),
      createdBy: [''],
      imageUrl: ['', Validators.pattern(/https?:\/\/.+\.(jpg|jpeg|png|webp|gif)/i)],
      tags: this.fb.array([])
    });
  }

  get instructions(): FormArray {
    return this.recipeForm.get('instructions') as FormArray;
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get tags(): FormArray {
    return this.recipeForm.get('tags') as FormArray;
  }

  createIngredientGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      amount: ['', Validators.required],
      unit: [''],
      category: ['Vegetables', Validators.required]
    });
  }

  createInstructionControl(): FormControl {
    return this.fb.control('', Validators.required);
  }

  createTagControl(): FormControl {
    return this.fb.control('', Validators.required);
  }

  addInstruction(): void {
    this.instructions.push(this.createInstructionControl());
  }

  removeInstruction(index: number): void {
    if (this.instructions.length > 1) {
      this.instructions.removeAt(index);
    }
  }

  addIngredient(): void {
    this.ingredients.push(this.createIngredientGroup());
  }

  removeIngredient(index: number): void {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  addTag(): void {
    this.tags.push(this.createTagControl());
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }
  // submit-idea.component.ts

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isFirstInstructionInvalid(): boolean {
    const array = this.recipeForm.get('instructions') as FormArray;
    const first = array.at(0);
    return (
      (!first?.value || !first.value.trim()) &&
      (first?.touched || first?.dirty || this.recipeForm.hasError('firstInstructionRequired', 'instructions'))
    );
  }

  getInstructionControl(index: number): FormControl {
    return this.instructions.at(index) as FormControl;
  }

  getIngredientControl(index: number, controlName: string): FormControl {
    return (this.ingredients.at(index) as FormGroup).get(controlName) as FormControl;
  }

  getNameControl(): FormControl {
    return this.recipeForm.get('name') as FormControl;
  }

  getImageUrlControl(): FormControl {
    return this.recipeForm.get('imageUrl') as FormControl;
  }

  getCuisineControl(): FormControl {
    return this.recipeForm.get('cuisine') as FormControl;
  }

  getDietTypeControl(): FormControl {
    return this.recipeForm.get('dietType') as FormControl;
  }

  getPrepTimeControl(): FormControl {
    return this.recipeForm.get('prepTime') as FormControl;
  }

  getCookTimeControl(): FormControl {
    return this.recipeForm.get('cookTime') as FormControl;
  }

  getServingsControl(): FormControl {
    return this.recipeForm.get('servings') as FormControl;
  }

  getDifficultyControl(): FormControl {
    return this.recipeForm.get('difficulty') as FormControl;
  }


  createRecipe(): void {
    if (!this.recipeId) {
      this.recipeForm.controls['createdBy'].setValue(this.user[0].id);

      this.newRecipeService.createRecipe(this.recipeForm.value).subscribe({
        next: (res: any) => {
          console.log('Recipe created successfully:', res);
          this.success = true;
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        },
        error: (err: any) => {
          console.error('Error creating recipe:', err);
          this.error = 'Failed to create recipe. Please try again.';
          this.isSubmitting = false;
        }
      })
    }
    else {
      this.newRecipeService.updateRecipe(this.recipeId, this.recipeForm.value).subscribe({
        next: (res: any) => {
          console.log('Recipe updated successfully:', res);
          this.success = true;
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        },
        error: (err: any) => {
          console.error('Error updating recipe:', err);
          this.error = 'Failed to update recipe. Please try again.';
          this.isSubmitting = false;
        }
      })

    }

  }

  getRecipeById(): void {
    if (this.recipeId) {
      this.newRecipeService.getRecipeById(this.recipeId).subscribe({
        next: (recipe: any) => {
          console.log('Fetched recipe:', recipe);
          this.recipeForm.patchValue({
            name: recipe.name,
            cuisine: recipe.cuisine,
            dietType: recipe.dietType,
            prepTime: recipe.prepTime,
            cookTime: recipe.cookTime,
            servings: recipe.servings,
            difficulty: recipe.difficulty,
            instructions: recipe.instructions || [''],
            ingredients: recipe.ingredients || [this.createIngredientGroup()],
            imageUrl: recipe.imageUrl || '',
            createdBy: this.user[0].id
          });
          
        },
        error: (err: any) => {
          console.error('Error fetching recipe:', err);
          this.error = 'Failed to load recipe. Please try again.';
        }
      })

    }
  }
}