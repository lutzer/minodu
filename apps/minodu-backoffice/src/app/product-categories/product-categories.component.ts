import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DateUtilsService } from '../_helpers/dateutils.service';
import { LoaderService } from '../_helpers/loader.service';
import { AuthService } from '../_services/auth.service';
import { Category } from '../_models/categories';
import { ProductCategoriesService } from '../_services/product-categories.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product-categories.component.html',
  styleUrl: './product-categories.component.css'
})

export class ProductCategoriesComponent implements OnInit {
  errorMessage = '';
  loading: boolean = true;
  categories: Category[] | null = null;
  categoryToDelete: Category | null = null;
  isDeleting: boolean = false;

  // Ajout/édition
  addCategoryForm: FormGroup;
  isFormSubmitted = false;
  isAdded = false;
  isUpdated = false;
  isSubmitting = false;
  isEditMode = false;
  currentCategoryId: number | null = null;
  image: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public dateUtilsService: DateUtilsService,
    public loaderService: LoaderService,
    private productCategoriesService: ProductCategoriesService,
    private authService: AuthService
  ) {
    this.addCategoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      image: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.productCategoriesService.getProductCategories().subscribe({
      next: data => {
        this.categories = data;
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

  onSubmit(): void {
    this.isFormSubmitted = true;
    const name = this.addCategoryForm.get('name')!.value;
    // Pour l'image, on utilise this.image
    if (this.addCategoryForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      if (this.isEditMode && this.currentCategoryId) {
        // Mode modification
        this.productCategoriesService.updateCategory(this.currentCategoryId, name, this.image || null).subscribe({
          next: data => {
            this.isUpdated = true;
            this.resetForm();
            setTimeout(() => {
              this.closeModal('modal-add-category');
              this.loadCategories();
            }, 1200);
          },
          error: err => {
            this.isSubmitting = false;
            this.errorMessage = err.error.message;
            // console.log(err.error)
          }
        });
      } else {
        // Mode ajout
        this.productCategoriesService.addCategory(name, this.image || null).subscribe({
          next: data => {
            this.isAdded = true;
            this.resetForm();
            setTimeout(() => {
              this.closeModal('modal-add-category');
              this.loadCategories();
            }, 1200);
          },
          error: err => {
            this.isSubmitting = false;
            this.errorMessage = err.error.message;
            // console.log(err.error)
          }
        });
      }
    }
  }

  editCategory(category: Category): void {
    this.isEditMode = true;
    this.currentCategoryId = category.id;
    this.addCategoryForm.patchValue({
      name: category.name
    });
    this.image = null;
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.image = event.target.files[0];
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentCategoryId = null;
    this.addCategoryForm.reset();
    this.image = null;
    this.isFormSubmitted = false;
    this.errorMessage = '';
  }

  resetForm(): void {
    setTimeout(() => {
      this.isFormSubmitted = false;
      this.isSubmitting = false;
      this.isEditMode = false;
      this.currentCategoryId = null;
      this.isAdded = false;
      this.isUpdated = false;
      this.addCategoryForm.reset();
      this.image = null;
    }, 1200);
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
    return this.isEditMode ? 'Modifier la catégorie' : 'Nouvelle catégorie';
  }

  getSubmitButtonText(): string {
    return this.isEditMode ? 'Modifier' : 'Ajouter';
  }

  confirmDelete(category: Category): void {
    this.categoryToDelete = category;
  }

  deleteCategory(): void {
    if (this.categoryToDelete) {
      this.isDeleting = true;
      this.productCategoriesService.deleteCategory(this.categoryToDelete.id).subscribe({
        next: () => {
          this.isDeleting = false;
          this.categoryToDelete = null;
          this.closeModal('modal-delete');
          this.loadCategories();
        },
        error: err => {
          this.isDeleting = false;
          this.errorMessage = err.error.message;
          // console.log(err.error);
        }
      });
    }
  }
}
