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
  loading: boolean = true;
  products: Product [] | null = null;
  categories: Category [] | null = null;
  addProductForm: FormGroup;
  isFormSubmitted = false;
  isAdded = false;
  isUpdated = false;
  isSubmitting = false;
  isDeleting = false;
  image: File | null = null;
  currentImageUrl: string | null = null;
  isEditMode = false;
  currentProductId: number | null = null;
  productToDelete: Product | null = null;
  fileInputId: string = 'productImageInput';

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
    this.loadProducts();
    this.loadCategories();
  }

  updateImageValidation(): void {
    const imageControl = this.addProductForm.get('image');
    if (!this.currentImageUrl) {
      // If no image URL, image is required
      imageControl?.setValidators([Validators.required]);
    } else {
      // If image URL exists, image is optional
      imageControl?.clearValidators();
    }
    imageControl?.updateValueAndValidity();
  }

  loadProducts(): void {
    this.loading = true;
    this.productsService.getProducts().subscribe({
      next: data => {
        this.products = data.map((item: any) => Product.fromJson(item));
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error.message;
        // console.log(err.error)
        this.authService.logout();
      }
    });
  }

  loadCategories(): void {
    this.productCategoriesService.getProductCategories().subscribe({
      next: data => {
        this.categories = data;
      },
      error: err => {
        this.errorMessage = err.error.message;
        // console.log(err.error)
      }
    });
  }

  onSubmit(): void {
    const name = this.addProductForm.get('name')!.value;
    const description = this.addProductForm.get('description')!.value;
    const category = this.addProductForm.get('category')!.value;
    const price = this.addProductForm.get('price')!.value;
    const salesUnit = this.addProductForm.get('sales-unit')!.value;
    this.isFormSubmitted = true;

    if (this.addProductForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      if (this.isEditMode && this.currentProductId) {
        // Mode modification
        this.productsService.updateProduct(this.currentProductId, name, description, category, price, salesUnit, this.image || undefined).subscribe({
          next: data => {
            this.isUpdated = true;
            this.resetForm();
            setTimeout(() => {
              this.closeModal('modal-add-product');
              this.loadProducts();
            }, 2000);
          },
          error: err => {
            // console.log(err.error)
            this.isSubmitting = false;
            this.errorMessage = err.error.message;
          }
        });
      } else {
        // Mode ajout
        this.productsService.addProduct(name, description, category, price, salesUnit, this.image!!).subscribe({
          next: data => {
            this.isAdded = true;
            this.resetForm();
            setTimeout(() => {
              this.closeModal('modal-add-product');
              this.loadProducts();
            }, 2000);
          },
          error: err => {
            // console.log(err.error)
            this.isSubmitting = false;
            this.errorMessage = err.error.message;
          }
        });
      }
    }
  }

  editProduct(product: Product): void {
    this.isEditMode = true;
    this.currentProductId = product.id;
    this.currentImageUrl = product.image;
    this.addProductForm.patchValue({
      name: product.name,
      description: product.description,
      category: product.category.id,
      price: product.price,
      'sales-unit': product.salesUnit
    });
    this.image = null;
    this.updateImageValidation();
  }

  confirmDelete(product: Product): void {
    this.productToDelete = product;
  }

  deleteProduct(): void {
    if (this.productToDelete) {
      this.isDeleting = true;
      this.productsService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.isDeleting = false;
          this.productToDelete = null;
          this.closeModal('modal-delete');
          this.loadProducts();
        },
        error: err => {
          this.isDeleting = false;
          this.errorMessage = err.error.message;
          // console.log(err.error);
        }
      });
    }
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.image = event.target.files[0];

       if (this.image && this.image.type.split('/')[0] !== 'image') {
      this.addProductForm.get('image')!.setValue('');
      this.addProductForm.get('image')!.setErrors({ 'invalidFileType': true });
      }else{
      const reader = new FileReader();
        reader.onload = () => {
          this.currentImageUrl = reader.result as string;
        };
        reader.readAsDataURL(this.image!!);
      }
    }
  }

  resetForm(): void {
    setTimeout(() => {
      this.isFormSubmitted = false;
      this.isSubmitting = false;
      this.isEditMode = false;
      this.currentProductId = null;
      this.currentImageUrl = null;
      this.isAdded = false;
      this.isUpdated = false;
      this.addProductForm.reset();
      this.image = null;
    }, 2000);
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentProductId = null;
    this.currentImageUrl = null;
    this.addProductForm.reset({
      name: '',
      description: '',
      category: '',
      image: '',
      price: '',
      'sales-unit': ''
    });
    this.addProductForm.updateValueAndValidity();
    this.image = null;
    this.isFormSubmitted = false;
    this.errorMessage = '';
  }

  closeModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      const backdrop = document.querySelector('.modal-backdrop');
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      if (backdrop) {
        backdrop.remove();
      }
    }
  }

  getModalTitle(): string {
    return this.isEditMode ? 'Modifier le produit' : 'Nouveau produit agricole';
  }

  getSubmitButtonText(): string {
    return this.isEditMode ? 'Modifier' : 'Soumettre';
  }

  removeImage() {
    this.currentImageUrl= null; 
    this.image= null; 
    
    // Réinitialiser le FormControl pour obliger l'utilisateur à uploader un nouveau fichier
    this.addProductForm.controls['image'].setValue(null);
    this.addProductForm.controls['image'].markAsTouched();
    this.updateImageValidation();
  }
}