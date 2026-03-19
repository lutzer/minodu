import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Tag } from '../_models/tags';
import { LoaderService } from '../_helpers/loader.service';
import { TagsService } from '../_services/tags.service';
import { AuthService } from '../_services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-tags',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './post-tags.component.html',
  styleUrl: './post-tags.component.css'
})
export class PostTagsComponent implements OnInit {
  tags: Tag[] = [];
  form: FormGroup;
  selectedTag: Tag | null = null;
  modalTitle = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;
  isDeleting = false;
  imageFile: File | undefined = undefined;
  currentImageUrl: string | null = null;
  deleteId: number | null = null;
  fileInputId: string = 'tagImageInput';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public loaderService: LoaderService,
    private tagsService: TagsService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      image: [null]
    });
  }

  ngOnInit(): void {
    this.loadTags();
  }

  loadTags() {
    this.loading = true;
    this.tagsService.getTags().subscribe({
      next: data => {
        this.tags = data;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.errorMessage = 'Une erreur est survenue lors du chargement des tags. Veuillez réessayer.';
        if (err.status === 401) this.authService.logout();
      }
    });
  }

  updateImageValidation(): void {
    const imageControl = this.form.get('image');
    if (!this.currentImageUrl) {
      // If no image URL, image is required
      imageControl?.setValidators([Validators.required]);
    } else {
      // If image URL exists, image is optional
      imageControl?.clearValidators();
    }
    imageControl?.updateValueAndValidity();
  }


  openAddModal() {
    this.resetForm();
    this.modalTitle = 'Ajouter un tag';
    this.selectedTag = null;
  }

  openEditModal(tag: Tag, event?: Event) {
    if (event) event.preventDefault();
    this.resetForm();
    this.modalTitle = 'Modifier le tag';
    this.selectedTag = tag;
    this.currentImageUrl = tag.image || null;
    this.form.patchValue({
      name: tag.name
    });
    this.imageFile = undefined;
    this.updateImageValidation();
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // Vérifier que c'est bien PNG ou JPG/JPEG
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
    this.currentImageUrl= null; 
    this.imageFile= undefined; 
    
    // Réinitialiser le FormControl pour obliger l'utilisateur à uploader un nouveau fichier
    this.form.controls['image'].setValue(null);
    this.form.controls['image'].markAsTouched();
    this.updateImageValidation();
  }


  submitForm() {
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const { name } = this.form.value;
    if (this.selectedTag) {
      this.tagsService.updateTag(this.selectedTag.id, name, this.imageFile).subscribe({
        next: _ => {
          this.successMessage = 'Tag modifié avec succès !';
          this.loadTags();
          this.isSubmitting = false;
          setTimeout(() => {
            this.closeModal('modal-tag');
            this.resetForm();
            this.successMessage = '';
          }, 2000);
        },
        error: err => {
          this.errorMessage = 'Une erreur s\'est produite lors de la modification du tag. Veuillez vérifier et réessayer.';
          this.isSubmitting = false;
        }
      });
    } else {
      this.tagsService.addTag(name, this.imageFile).subscribe({
        next: _ => {
          this.successMessage = 'Tag ajouté avec succès !';
          this.loadTags();
          this.isSubmitting = false;
          setTimeout(() => {
            this.closeModal('modal-tag');
            this.resetForm();
            this.successMessage = '';
          }, 2000);
        },
        error: err => {
          this.errorMessage = 'Une erreur s\'est produite lors de l\'ajout du tag. Veuillez vérifier et réessayer.';
          this.isSubmitting = false;
        }
      });
    }
  }

  confirmDelete(id: number, event?: Event) {
    if (event) event.preventDefault();
    this.deleteId = id;
  }

  deleteTag() {
    if (!this.deleteId) return;
    this.isDeleting = true;
    this.tagsService.deleteTag(this.deleteId).subscribe({
      next: _ => {
        this.successMessage = 'Tag supprimé avec succès !';
        this.loadTags();
        this.closeModal('modal-delete-tag');
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
    this.selectedTag = null;
    this.imageFile = undefined;
    this.currentImageUrl = null;
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = false;
  }
}
