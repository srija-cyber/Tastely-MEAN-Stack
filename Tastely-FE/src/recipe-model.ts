export interface Recipe {
  id?: string;
  name: string;
  cuisine: string;
  dietType: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  ingredients: Ingredient[];
  instructions: string[]; 
  imageUrl?: string;
  tags: string[];
  author_email: string;
  author_name: string;
  likes?: number;
  liked_by?: string[];
  comments?: Comment[];
  createdAt?: Date;
  updatedAt?: Date;
 

  nutrition?: {
    calories?: number;
    [key: string]: any;
  };
}

export 
interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}
