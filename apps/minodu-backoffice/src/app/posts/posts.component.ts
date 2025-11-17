import { Component, OnInit } from '@angular/core';
import { Post } from '../_models/posts';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DateUtilsService } from '../_helpers/dateutils.service';
import { LoaderService } from '../_helpers/loader.service';
import { UserService } from '../_services/users.service';
import { AuthService } from '../_services/auth.service';
import { PostService } from '../_services/posts.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../_models/products';
import { Category } from '../_models/categories';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {
      errorMessage = '';
      loading: boolean = false;
      posts: Post [] | null = null;
      addPostForm: FormGroup;
      isFormSubmitted = false;
      isAdded= false;
      isSubmitting = false;
      image: File | null = null;
      products: Product [] | null = null;
      categories: Category [] | null = null;

  constructor(private formBuilder: FormBuilder, private router: Router, public dateUtilsService: DateUtilsService, public loaderService: LoaderService, private postService: PostService, private authService: AuthService){
     this.addPostForm = this.formBuilder.group({
            name: ['', [Validators.required]],
            description: ['', Validators.required],
            category: ['', Validators.required],
            image: ['', null],
            price: ['', null],
            'sales-unit': ['', Validators.required],
        });
  }
    
  ngOnInit(): void {
    this.postService.getPosts().subscribe({
          next: data => {
            this.posts = data;
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


  onSubmit(): void {
    const name = this.addPostForm.get('name')!.value;
    const description = this.addPostForm.get('description')!.value;
    const category = this.addPostForm.get('category')!.value;
    const image = this.addPostForm.get('image')!.value;
    const price = this.addPostForm.get('price')!.value;
    const salesUnit = this.addPostForm.get('sales-unit')!.value;
    this.isFormSubmitted = true;

    if (this.addPostForm.valid) {
        this.isSubmitting = true;
        this.errorMessage = '';
        this.postService.addPost(name, description, this.image!!).subscribe({
          next: data => {
                this.isAdded = true;
                setTimeout(() => {
                  this.isFormSubmitted = false;
                  this.isSubmitting = false;
                  this.addPostForm.reset();
                }, 3000);
                setTimeout(() => {
                  this.isAdded = false;
                  window.location.reload();
                }, 4000);
          },
          error: err => {
            console.log(err.error)
            this.isSubmitting = false;
            this.errorMessage = err.error.message;
          }
        });
    }
  }


  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.image = event.target.files[0];
    }
  }

}
