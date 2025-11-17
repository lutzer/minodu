import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DateUtilsService } from '../_helpers/dateutils.service';
import { LoaderService } from '../_helpers/loader.service';
import { AuthService } from '../_services/auth.service';
import { Category } from '../_models/categories';
import { ProductCategoriesService } from '../_services/product-categories.service';

@Component({
  selector: 'app-product-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-categories.component.html',
  styleUrl: './product-categories.component.css'
})
export class ProductCategoriesComponent implements OnInit {
      errorMessage = '';
      loading: boolean = false;
      categories: Category [] | null = null;

    constructor(private router: Router, public dateUtilsService: DateUtilsService, public loaderService: LoaderService, private productCategoriesService: ProductCategoriesService, private authService: AuthService){}

  ngOnInit(): void {
    this.productCategoriesService.getProductCategories().subscribe({
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
