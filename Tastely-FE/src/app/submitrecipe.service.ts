import { Injectable } from '@angular/core';
import { Recipe } from '../recipe-model';
import { catchError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubmitrecipeService {
    private apiUrl = 'http://localhost:3000/my-recipes'; 
  constructor(private http: HttpClient) {}

  // Add a new recipe
  addRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, recipe);
  }

    addToMyRecipes(recipe: Omit<Recipe, 'id'>): Observable<Recipe> {
      return this.http.post<Recipe>(`${this.apiUrl}`, recipe)
        .pipe(catchError(this.handleError));
    }


  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl);
  }

  getRecipesByAuthor(authorEmail: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}?author_email=${authorEmail}`);
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  updateRecipe(id: string, recipe: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${id}`, recipe);
  }

  deleteRecipe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  likeRecipe(recipeId: string, userId: string): Observable<Recipe> {
    return this.http.patch<Recipe>(`${this.apiUrl}/${recipeId}`, {
      $push: { liked_by: userId },
      $inc: { likes: 1 }
    });
  }

  unlikeRecipe(recipeId: string, userId: string): Observable<Recipe> {
    return this.http.patch<Recipe>(`${this.apiUrl}/${recipeId}`, {
      $pull: { liked_by: userId },
      $inc: { likes: -1 }
    });
  }

  searchRecipes(query: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}?q=${query}`);
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    throw error;
  }
}