import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from '../recipe-model';

@Injectable({
  providedIn: 'root'
})
export class NewrecipeService {
  baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  addRecipe(recipe: any) {
    return this.http.post(`${this.baseUrl}/recipes`, recipe);
  }

  getRecipes(filters?: {
    ingredients?: string[],
    cuisine?: string,
    query?: string,
    dietType?: string
  }): Observable<any> {
    let params = new HttpParams();

    if (filters) {
      if (filters.ingredients && filters.ingredients.length > 0) {
        params = params.append('ingredients', filters.ingredients.join(','));
      }
      if (filters.cuisine && filters.cuisine !== 'All') {
        params = params.append('cuisine', filters.cuisine);
      }
      if (filters.query) {
        params = params.append('query', filters.query);
      }
      if (filters.dietType) {
        params = params.append('dietType', filters.dietType);
      }
    }

    return this.http.get(`${this.baseUrl}/recipes`, { params });
  }

  createRecipe(recipe: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/recipes`, recipe);
  }

  getRecipesByAuthor(id: any): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.baseUrl}/recipes/user/${id}`);
  }

  getBlogs(category?: string): Observable<any> {
    let params = new HttpParams();

    if (category) {
      params = params.append('category', category);
    }

    return this.http.get(`${this.baseUrl}/blogs`, { params });
  }

  getBlogCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/blogs/categories`);
  }
  getBlogById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/blogs/${id}`);
  }


  deleteRecipe(id: any): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/recipes/user/${id}`);
  }

  editRecipe(id: any, recipe: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/recipes/user/${id}`, recipe);
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.baseUrl}/recipes/${id}`);
  }

  updateRecipe(id: string, recipe: any): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.baseUrl}/recipes/${id}`, recipe);
  }

  likeRecipe(recipeId: string, userId: string): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.baseUrl}/recipes/${recipeId}/like`, { userId });
  }

  getLikedRecipesByUser(userId: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.baseUrl}/recipes/liked/${userId}`);
  }
}
