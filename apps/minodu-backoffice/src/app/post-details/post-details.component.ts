import { Component, OnInit } from '@angular/core';
import { Post } from '../_models/posts';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DateUtilsService } from '../_helpers/dateutils.service';
import { LoaderService } from '../_helpers/loader.service';
import { UserService } from '../_services/users.service';
import { PostService } from '../_services/posts.service';
import { AuthService } from '../_services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css'
})
export class PostDetailsComponent implements OnInit {
    errorMessage = '';
    loading: boolean = false;
    post: Post | null = null;

  constructor(private router: Router, private route: ActivatedRoute, public dateUtilsService: DateUtilsService, public loaderService: LoaderService, private postService: PostService, private authService: AuthService, private sanitizer: DomSanitizer){}
  
  ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
      const id = params.get('id');
          this.postService.getPost(id!!).subscribe({
          next: data => {
            this.post = Post.fromJson(data);
            this.loading = false;
            console.log(this.post)
          },
          error: err => {
            this.loading = false;
            this.errorMessage = err.error.message;
            this.authService.logout();
          }
        });
    });
  }

  getSafeUrl(url: string) {
  return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
