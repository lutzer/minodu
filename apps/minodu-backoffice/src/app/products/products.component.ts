import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../_models/products';
import { DateUtilsService } from '../_helpers/dateutils.service';
import { LoaderService } from '../_helpers/loader.service';
import { ProductsService } from '../_services/products.service';
import { AuthService } from '../_services/auth.service';
import { ProductCategoriesService } from '../_services/product-categories.service';
import { Category } from '../_models/categories';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  errorMessage = '';
  loading: boolean = false;
  products: Product [] | null = null;
  categories: Category [] | null = null;
  addProductForm: FormGroup;
  isFormSubmitted = false;
  isAdded= false;
  isSubmitting = false;
  image: File | null = null;



    constructor(private formBuilder: FormBuilder, private router: Router, public dateUtilsService: DateUtilsService, public loaderService: LoaderService, private productsService: ProductsService,  private productCategoriesService: ProductCategoriesService, private authService: AuthService){
        this.addProductForm = this.formBuilder.group({
        name: ['', [Validators.required]],
        description: ['', Validators.required],
        category: ['', Validators.required],
        image: ['', null],
        price: ['', null],
        'sales-unit': ['', Validators.required],
    });
    }

  ngOnInit(): void {
    this.productsService.getProducts().subscribe({
          next: data => {
            this.products = data.map((item: any) => Product.fromJson(item));
            this.loading = false;
          },
          error: err => {
            this.loading = false;
            this.errorMessage = err.error.message;
            console.log(err.error)
            this.authService.logout();
          }
        });

    this.productCategoriesService.getProductCategories().subscribe({
          next: data => {
            this.categories = data;//.map((item: any) => Product.fromJson(item));
            this.loading = false;
          },
          error: err => {
            this.loading = false;
            this.errorMessage = err.error.message;
            console.log(err.error)
          }
        });
  }

  onSubmit(): void {
    const name = this.addProductForm.get('name')!.value;
    const description = this.addProductForm.get('description')!.value;
    const category = this.addProductForm.get('category')!.value;
    const image = this.addProductForm.get('image')!.value;
    const price = this.addProductForm.get('price')!.value;
    const salesUnit = this.addProductForm.get('sales-unit')!.value;
    this.isFormSubmitted = true;

    if (this.addProductForm.valid) {
        this.isSubmitting = true;
        this.errorMessage = '';
        this.productsService.addProduct(name, description, category, price, salesUnit, this.image!!).subscribe({
          next: data => {
                this.isAdded = true;
                setTimeout(() => {
                  this.isFormSubmitted = false;
                  this.isSubmitting = false;
                  this.addProductForm.reset();
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
