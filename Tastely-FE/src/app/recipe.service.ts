import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap, throwError } from 'rxjs';
import { Recipe } from '../recipe-model';


interface Comment {
  id?: string;
  userId: string;
  text: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  getFilteredRecipes(
    selectedIngredients: string[] = [],
    selectedCuisine: string = 'All',
    dishQuery: string = '',
    selectedDietType: string = ''
  ): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/recipes`).pipe(
      map(recipes => recipes.filter(recipe => {
        const matchesCuisine = selectedCuisine === 'All' || 
          recipe.cuisine.toLowerCase() === selectedCuisine.toLowerCase();
        
        const matchesDishName = dishQuery.trim() === '' || 
          recipe.name.toLowerCase().includes(dishQuery.toLowerCase());
        
        const matchesDietType = selectedDietType === '' || 
          recipe.dietType === selectedDietType;

        const matchedIngredients = selectedIngredients.length === 0 ? true : 
          selectedIngredients.some(ing =>
            recipe.ingredients.map(i => i.name.toLowerCase()).includes(ing.toLowerCase())
          );

        return matchesCuisine && matchesDishName && matchesDietType && matchedIngredients;
      })),
      catchError(this.handleError)
    );
  }

  addRecipe(recipe: Omit<Recipe, 'id'>): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/recipes`, recipe)
      .pipe(catchError(this.handleError));
  }

  addComment(recipeId: string, comment: Omit<Comment, 'id'>): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/recipes/${recipeId}/comments`, comment)
      .pipe(catchError(this.handleError));
  }

  getComments(recipeId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/recipes/${recipeId}/comments`)
      .pipe(catchError(this.handleError));
  }

  likeRecipe(recipeId: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/recipes/${recipeId}`).pipe(
      switchMap(recipe => {
        const updatedRecipe = {
          ...recipe,
          likes: (recipe.likes || 0) + 1
        };
        return this.http.put<Recipe>(`${this.apiUrl}/recipes/${recipeId}`, updatedRecipe);
      }),
      catchError(this.handleError)
    );
  }

  getTopRecipes(limit: number = 5): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(
      `${this.apiUrl}/recipes?_sort=likes&_order=desc&_limit=${limit}`
    ).pipe(catchError(this.handleError));
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/recipes/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(
      'Something went wrong; please try again later.'
    ));
  }

  // Add to user's personal recipes collection
  addToMyRecipes(recipe: Omit<Recipe, 'id'>): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/my-recipes`, recipe)
      .pipe(catchError(this.handleError));
  }

  
  private generateId(): string {
    return 'recipe-' + Math.random().toString(36).substring(2, 9);
  }

    createRecipe(recipeData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/my-recipes`, recipeData);
  }

    getUserRecipes(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${userId}/recipes`);
  }

  getRecipesByAuthor(email: string): Observable<Recipe[]> {
  return this.http.get<Recipe[]>(`${this.apiUrl}/recipes`).pipe(
    map(recipes => recipes.filter(recipe => recipe.author_email === email)),
    catchError(this.handleError)
  );
}

}