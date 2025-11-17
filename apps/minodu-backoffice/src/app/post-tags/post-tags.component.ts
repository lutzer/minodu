import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Tag } from '../_models/tags';
import { DateUtilsService } from '../_helpers/dateutils.service';
import { LoaderService } from '../_helpers/loader.service';
import { PostService } from '../_services/posts.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-post-tags',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post-tags.component.html',
  styleUrl: './post-tags.component.css'
})
export class PostTagsComponent implements OnInit {
      errorMessage = '';
      loading: boolean = false;
      tags: Tag [] | null = null;

      constructor(private router: Router, public dateUtilsService: DateUtilsService, public loaderService: LoaderService, private postService: PostService, private authService: AuthService){}

    ngOnInit(): void {
    this.postService.getPostTags().subscribe({
          next: data => {
            this.tags = data;
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
