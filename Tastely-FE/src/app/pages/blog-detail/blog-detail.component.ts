import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Blog } from '../../../blog-modelling';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NewrecipeService } from '../../newrecipe.service';

@Component({
  selector: 'app-blog-detail',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  blog$!: Observable<Blog>;
  blogId: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private newService: NewrecipeService
  ) { }

  ngOnInit(): void {
    this.blogId = this.route.snapshot.paramMap.get('id');
    if (this.blogId) {
      this.blog$ = this.newService.getBlogById(this.blogId);
    }
  }
}