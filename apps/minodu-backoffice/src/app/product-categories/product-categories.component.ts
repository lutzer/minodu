import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DateUtilsService } from '../_helpers/dateutils.service';
import { LoaderService } from '../_helpers/loader.service';
import { AuthService } from '../_services/auth.service';
import { Category } from '../_models/categories';
import { ProductCategoriesService } from '../_services/product-categories.service';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

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

  addCategoryForm: FormGroup;
  isFormSubmitted = false;
  isAdded = false;
  isUpdated = false;
  isSubmitting = false;
  isEditMode = false;
  currentCategoryId: number | null = null;
  image: File | null = null;
  currentImageUrl: string | null = null;
  fileInputId: string = 'categoryImageInput';

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
        this.authService.logout();
      }
    });
  }

  updateImageValidation(): void {
    const imageControl = this.addCategoryForm.get('image');
    if (!this.currentImageUrl) {
      imageControl?.setValidators([Validators.required]);
    } else {
      imageControl?.clearValidators();
    }
    imageControl?.updateValueAndValidity();
  }

  onFileChange(event: any) {
    const file = event.target.files?.[0];

    if (!file) return;

    // Vérification du type MIME
    if (!file.type.startsWith('image/')) {
      this.image = null;
      this.addCategoryForm.get('image')!.setValue('');
      this.addCategoryForm.get('image')!.setErrors({ invalidFileType: true });
      return;
    }

    // ✅ FIX : on stocke le File correctement
    this.image = file;

    // Prévisualisation
    const reader = new FileReader();
    reader.onload = () => {
      this.currentImageUrl = reader.result as string;
      // L'image est valide : on vide les erreurs et on met une valeur
      this.addCategoryForm.get('image')!.setValue(file.name);
      this.addCategoryForm.get('image')!.setErrors(null);
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.currentImageUrl = null;
    this.image = null;
    this.addCategoryForm.controls['image'].setValue(null);
    this.addCategoryForm.controls['image'].markAsTouched();
    // Réinitialiser le champ fichier dans le DOM
    const fileInput = document.getElementById(this.fileInputId) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    this.updateImageValidation();
  }

  onSubmit(): void {
    this.isFormSubmitted = true;
    const name = this.addCategoryForm.get('name')!.value;

    if (this.addCategoryForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      // ✅ FIX PRINCIPAL : construction du FormData ici, pas dans le service
      const formData = new FormData();
      formData.append('name', name);
      if (this.image) {
        formData.append('image', this.image, this.image.name);
      }

      if (this.isEditMode && this.currentCategoryId) {
        this.productCategoriesService.updateCategory(this.currentCategoryId, formData).subscribe({
          next: () => {
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
          }
        });
      } else {
        this.productCategoriesService.addCategory(formData).subscribe({
          next: () => {
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
          }
        });
      }
    }
  }

  editCategory(category: Category): void {
    this.isEditMode = true;
    this.currentCategoryId = category.id;
    this.currentImageUrl = category.image;
    this.addCategoryForm.patchValue({ name: category.name });
    this.image = null;
    this.updateImageValidation();
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentCategoryId = null;
    this.addCategoryForm.reset();
    this.currentImageUrl = null;
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
      this.currentImageUrl = null;
      this.image = null;
      this.isAdded = false;
      this.isUpdated = false;
      this.addCategoryForm.reset();
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
      if (backdrop) backdrop.remove();
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
        }
      });
    }
  }
}