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
        this.errorMessage = err.error?.message || 'Erreur lors du chargement des catégories';
        if (err.status === 401) this.authService.logout();
      }
    });
  }

  openAddModal() {
    this.resetForm();
    this.modalTitle = 'Ajouter une catégorie';
    this.selectedCategory = null;
    (window as any).bootstrap.Modal.getOrCreateInstance(document.getElementById('modal-category')).show();
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
    (window as any).bootstrap.Modal.getOrCreateInstance(document.getElementById('modal-category')).show();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.imageFile = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submitForm() {
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const name = this.form.value.name;
    const nameKb = this.form.value.nameKb;
    if (this.selectedCategory) {
      this.postCategoriesService.updatePostCategory(this.selectedCategory.id, name, nameKb, this.imageFile).subscribe({
        next: _ => {
          this.successMessage = 'Catégorie modifiée avec succès';
          this.loadCategories();
          this.closeModal();
          this.isSubmitting = false;
        },
        error: err => {
          this.errorMessage = err.error?.message || 'Erreur lors de la modification';
          this.isSubmitting = false;
        }
      });
    } else {
      this.postCategoriesService.addPostCategory(name, nameKb, this.imageFile).subscribe({
        next: _ => {
          this.successMessage = 'Catégorie ajoutée avec succès';
          this.loadCategories();
          this.closeModal();
          this.isSubmitting = false;
        },
        error: err => {
          this.errorMessage = err.error?.message || 'Erreur lors de l\'ajout';
          this.isSubmitting = false;
        }
      });
    }
  }

  confirmDelete(id: number, event?: Event) {
    if (event) event.preventDefault();
    this.deleteId = id;
    (window as any).bootstrap.Modal.getOrCreateInstance(document.getElementById('modal-delete-category')).show();
  }

  deleteCategory() {
    if (!this.deleteId) return;
    this.isDeleting = true;
    this.postCategoriesService.deletePostCategory(this.deleteId).subscribe({
      next: _ => {
        this.successMessage = 'Catégorie supprimée avec succès';
        this.loadCategories();
        this.closeModal('delete');
        this.isDeleting = false;
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Erreur lors de la suppression';
        this.isDeleting = false;
      }
    });
  }

  closeModal(type: 'delete' | 'form' = 'form') {
    if (type === 'form') {
      (window as any).bootstrap.Modal.getOrCreateInstance(document.getElementById('modal-category')).hide();
      this.resetForm();
    } else {
      (window as any).bootstrap.Modal.getOrCreateInstance(document.getElementById('modal-delete-category')).hide();
      this.deleteId = null;
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
