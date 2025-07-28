import { Component, OnInit } from '@angular/core';
import { Blog } from '../../../blog-modelling';
import { Observable, combineLatest } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { startWith, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewrecipeService } from '../../newrecipe.service';
import { FooterComponent } from '../../pages/footer/footer.component';

@Component({
  selector: 'app-blog-list',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink, FooterComponent],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  blogs$!: Observable<Blog[]>;
  categories$!: Observable<string[]>;
  searchControl = new FormControl('');
  categoryControl = new FormControl('');

  constructor( private newRecipeService: NewrecipeService) { }

  blogs: any[] = [];
  categories: any[] = [];
  isLoading = false;
  error: string | null = null;
  selectedCategory: string = '';

  ngOnInit(): void {
    this.fetchBlogs();
    this.fetchCategories();

    this.categoryControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((category) => {
        console.log('Selected category:', category);
        console.log();
        this.blogs = this.categories.filter(blog =>
          !category || blog.categories.includes(category)
        );
      });
  }

  fetchBlogs(): void {
    this.isLoading = true;
    this.error = null;

    this.newRecipeService.getBlogs(this.selectedCategory).subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        this.categories = blogs;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load blogs. Please try again.';
        console.error('Error fetching blogs:', err);
        this.isLoading = false;
      }
    });
  }

  fetchCategories(): void {
    this.newRecipeService.getBlogCategories().subscribe({
      next: (categories) => {
        this.categories$ = new Observable(observer => observer.next(categories));
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }

  onSearch() {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    this.blogs = this.categories.filter(blog =>
      blog.title.toLowerCase().includes(searchTerm) ||
      blog.shortDescription.toLowerCase().includes(searchTerm)
    );
  }

}     