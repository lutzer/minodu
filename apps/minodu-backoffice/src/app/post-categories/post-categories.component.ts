import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Category } from '../_models/categories';
import { LoaderService } from '../_helpers/loader.service';
import { PostCategoriesService } from '../_services/post-categories.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-post-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './post-categories.component.html',
  styleUrl: './post-categories.component.css'
})
export class PostCategoriesComponent implements OnInit {
  categories: Category[] = [];
  form: FormGroup;
  selectedCategory: Category | null = null;
  modalTitle = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;
  isDeleting = false;
  imageFile: File | undefined = undefined;
  currentImageUrl: string | null = null;
  deleteId: number | null = null;
  fileInputId: string = 'categoryImageInput';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public loaderService: LoaderService,
    private postCategoriesService: PostCategoriesService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      nameKb: ['', Validators.required],
      image: [null]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.postCategoriesService.getPostCategories().subscribe({
      next: data => {
        this.categories = data;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.errorMessage = 'Une erreur est survenue lors du chargement des catégories. Veuillez réessayer.';
        if (err.status === 401) this.authService.logout();
      }
    });
  }

  updateImageValidation(): void {
    const imageControl = this.form.get('image');
    if (!this.currentImageUrl) {
      imageControl?.setValidators([Validators.required]);
    } else {
      imageControl?.clearValidators();
    }
    imageControl?.updateValueAndValidity();
  }

  openAddModal() {
    this.resetForm();
    this.modalTitle = 'Ajouter une catégorie';
    this.selectedCategory = null;
  }

  openEditModal(category: Category, event?: Event) {
    if (event) event.preventDefault();
    this.resetForm();
    this.modalTitle = 'Modifier la catégorie';
    this.selectedCategory = category;
    this.currentImageUrl = category.image || null;
    this.form.patchValue({
      name: category.name,
      nameKb: category.nameKb
    });
    this.imageFile = undefined;
    this.updateImageValidation();
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      const validImageTypes = ['image/png', 'image/jpeg'];
      if (!validImageTypes.includes(file.type)) {
        this.form.get('image')!.setValue('');
        this.form.get('image')!.setErrors({ 'invalidFileType': true });
        return;
      }

      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.currentImageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.currentImageUrl = null;
    this.imageFile = undefined;
    this.form.controls['image'].setValue(null);
    this.form.controls['image'].markAsTouched();
    this.updateImageValidation();
  }

  submitForm() {
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const name = this.form.value.name;
    const nameKb = this.form.value.nameKb;

    if (this.selectedCategory) {
      this.postCategoriesService.updatePostCategory(this.selectedCategory.id, name, nameKb, this.imageFile).subscribe({
        next: _ => {
          this.successMessage = 'Catégorie modifiée avec succès !';
          this.isSubmitting = false;
          setTimeout(() => {
            this.closeModal('modal-category');
            this.resetForm();
            this.loadCategories();
          }, 2000);
        },
        error: err => {
          this.errorMessage = 'Une erreur s\'est produite lors de la modification de la catégorie. Veuillez vérifier et réessayer.';
          this.isSubmitting = false;
        }
      });
    } else {
      this.postCategoriesService.addPostCategory(name, nameKb, this.imageFile).subscribe({
        next: _ => {
          this.successMessage = 'Catégorie ajoutée avec succès !';
          this.isSubmitting = false;
          setTimeout(() => {
            this.closeModal('modal-category');
            this.resetForm();
            this.loadCategories();
          }, 2000);
        },
        error: err => {
          this.errorMessage = 'Une erreur s\'est produite lors de l\'ajout de la catégorie. Veuillez vérifier et réessayer.';
          this.isSubmitting = false;
        }
      });
    }
  }

  confirmDelete(id: number, event?: Event) {
    if (event) event.preventDefault();
    this.deleteId = id;
  }

  deleteCategory() {
    if (!this.deleteId) return;
    this.isDeleting = true;
    this.postCategoriesService.deletePostCategory(this.deleteId).subscribe({
      next: _ => {
        this.successMessage = 'Catégorie supprimée avec succès !';
        this.loadCategories();
        this.closeModal('modal-delete-category');
        this.deleteId = null;
        this.isDeleting = false;
      },
      error: err => {
        this.errorMessage = 'Une erreur s\'est produite lors de la suppression. Veuillez réessayer.';
        this.isDeleting = false;
      }
    });
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  resetForm() {
    this.form.reset();
    this.selectedCategory = null;
    this.currentImageUrl = null;
    this.imageFile = undefined;
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = false;
  }
}