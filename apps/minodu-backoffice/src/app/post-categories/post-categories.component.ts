import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Category } from '../_models/categories';
import { DateUtilsService } from '../_helpers/dateutils.service';
import { LoaderService } from '../_helpers/loader.service';
import { PostService } from '../_services/posts.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-post-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post-categories.component.html',
  styleUrl: './post-categories.component.css'
})
export class PostCategoriesComponent implements OnInit {
      errorMessage = '';
      loading: boolean = false;
      categories: Category [] | null = null;

      constructor(private router: Router, public dateUtilsService: DateUtilsService, public loaderService: LoaderService, private postService: PostService, private authService: AuthService){}

    ngOnInit(): void {
    this.postService.getPostCategories().subscribe({
          next: data => {
            this.categories = data;
            this.loading = false;
          },
          error: err => {
            this.loading = false;
            this.errorMessage = err.error.message;
            console.log(err.error)
            this.authService.logout();
          }
        });
  }
      
}
