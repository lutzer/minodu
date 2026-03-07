import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post } from '../_models/posts';
import { Category } from '../_models/categories';
import { Tag } from '../_models/tags';
import { TagsService } from '../_services/tags.service';
import { PostCategoriesService } from '../_services/post-categories.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DateUtilsService } from '../_helpers/dateutils.service';
import { LoaderService } from '../_helpers/loader.service';
import { AuthService } from '../_services/auth.service';
import { PostService } from '../_services/posts.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  categories: Category[] = [];
  tags: Tag[] = [];
  form: FormGroup;
  selectedPost: Post | null = null;
  modalTitle = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;
  isDeleting = false;
  imageFile: File | undefined = undefined;
  currentImageUrl: string | null = null;
  attachmentFile: File | undefined = undefined;
  attachmentKbFile: File | undefined = undefined;
  attachmentPdfFile: File | undefined = undefined;
  deleteId: number | null = null;
  selectedTags: number[] = []; // Pour gérer les tags sélectionnés
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  fileInputId: string = 'postImageInput';
  image: File | null = null;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dateUtilsService: DateUtilsService,
    public loaderService: LoaderService,
    private postService: PostService,
    private tagsService: TagsService,
    private postCategoriesService: PostCategoriesService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      author: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.required],
      idCategory: [null, Validators.required],
      tags: [[], Validators.required],
      image: [null],
      attachment: [null],
      attachmentKb: [null],
      attachmentPdf: [null]
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.postService.getPosts().subscribe({
      next: data => {
        this.posts = data;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors du chargement des publications';
        if (err.status === 401) this.authService.logout();
      }
    });
    this.postCategoriesService.getPostCategories().subscribe({
      next: data => { this.categories = data; },
      error: _ => { this.categories = []; }
    });
    this.tagsService.getTags().subscribe({
      next: data => { this.tags = data; },
      error: _ => { this.tags = []; }
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
    this.modalTitle = 'Ajouter une publication';
    this.selectedPost = null;
    this.selectedTags = [];
    (window as any).bootstrap.Modal.getOrCreateInstance(document.getElementById('modal-report')).show();
  }

  openEditModal(post: Post, event?: Event) {
    if (event) event.preventDefault();
    this.resetForm();
    this.modalTitle = 'Modifier la publication';
    this.selectedPost = post;
    this.currentImageUrl = post.image || null;
    this.selectedTags = post.tags?.map(t => t.id) || [];
    this.form.patchValue({
      author: post.author,
      title: post.title,
      description: post.description,
      idCategory: post.category?.id ? Number(post.category.id) : null,
      tags: this.selectedTags
    });
    this.imageFile = undefined;
    this.updateImageValidation();
    (window as any).bootstrap.Modal.getOrCreateInstance(document.getElementById('modal-report')).show();
  }

  onFileChange(event: any, type: 'image' | 'attachment' | 'attachmentKb' | 'attachmentPdf') {
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        this.imageFile = file;
        this.imageFile = event.target.files[0];

        if (this.imageFile && this.imageFile.type.split('/')[0] !== 'image') {
        this.form.get('image')!.setValue('');
        this.form.get('image')!.setErrors({ 'invalidFileType': true });
        }else{
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.currentImageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
          reader.onload = () => {
            this.currentImageUrl = reader.result as string;
          };
          reader.readAsDataURL(this.imageFile!!);
      }

      if (type === 'attachment') this.attachmentFile = file;
      if (type === 'attachmentKb') this.attachmentKbFile = file;
      if (type === 'attachmentPdf') this.attachmentPdfFile = file;
    }
  }

  removeImage() {
    this.currentImageUrl= null; 
    this.image= null; 
    
    // Réinitialiser le FormControl pour obliger l'utilisateur à uploader un nouveau fichier
    this.form.controls['image'].setValue(null);
    this.form.controls['image'].markAsTouched();
    this.updateImageValidation();
  }


  // Méthode pour basculer la sélection d'un tag (pour le clic sur l'image)
  toggleTag(tagId: number) {
    if (this.selectedTags.includes(tagId)) {
      this.selectedTags = this.selectedTags.filter(id => id !== tagId);
    } else {
      this.selectedTags.push(tagId);
    }
    this.form.patchValue({ tags: this.selectedTags });
  }

  // Gestion des tags avec checkboxes
  onTagChange(tagId: number, event: any) {
    if (event.target.checked) {
      if (!this.selectedTags.includes(tagId)) {
        this.selectedTags.push(tagId);
      }
    } else {
      this.selectedTags = this.selectedTags.filter(id => id !== tagId);
    }
    this.form.patchValue({ tags: this.selectedTags });
  }

  isTagSelected(tagId: number): boolean {
    return this.selectedTags.includes(tagId);
  }

  trackByTagId(index: number, tag: Tag): number {
    return tag.id;
  }

  submitForm() {
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const { author, title, description, idCategory } = this.form.value;
    const idCategoryNum = idCategory ? Number(idCategory) : null;
    
    if (idCategoryNum === null) {
      this.errorMessage = "La catégorie est requise.";
      this.isSubmitting = false;
      return;
    }

    if (this.selectedTags.length === 0) {
      this.errorMessage = "Au moins un tag est requis.";
      this.isSubmitting = false;
      return;
    }

    const tagsStr = this.selectedTags.join(',');
    
    if (this.selectedPost) {
      this.postService.updatePost(
        this.selectedPost.id, 
        author, 
        title, 
        description, 
        idCategoryNum, 
        tagsStr, 
        this.imageFile, 
        this.attachmentFile,     // Audio français
        this.attachmentKbFile,   // Audio kabyé (fichier)
        this.attachmentPdfFile,  // PDF
        undefined                // resources
      ).subscribe({
        next: _ => {
          this.successMessage = 'Publication modifiée avec succès';
          this.loadAll();
          this.closeModal();
          this.isSubmitting = false;
        },
        error: err => {
          this.errorMessage = err.error?.message || 'Erreur lors de la modification';
          this.isSubmitting = false;
        }
      });
    } else {
      this.postService.addPost(
        author, 
        title, 
        description, 
        idCategoryNum, 
        tagsStr, 
        this.imageFile, 
        this.attachmentFile,     // Audio français
        this.attachmentKbFile,   // Audio kabyé (fichier)
        this.attachmentPdfFile,  // PDF
        undefined                // resources
      ).subscribe({
        next: _ => {
        this.successMessage = this.selectedPost ? 
            'Publication modifiée avec succès' : 
            'Publication ajoutée avec succès';

        this.loadAll();
        this.isSubmitting = false;

        // Laisser le message visible 1s avant de fermer le modal
        setTimeout(() => {
          this.closeModal();
          // Effacer le message après fermeture si tu veux
          this.successMessage = '';
        }, 2000);
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
    (window as any).bootstrap.Modal.getOrCreateInstance(document.getElementById('modal-delete')).show();
  }

  deletePost() {
    if (!this.deleteId) return;
    this.isDeleting = true;
    this.postService.deletePost(this.deleteId).subscribe({
      next: _ => {
        this.successMessage = 'Publication supprimée avec succès';
        this.loadAll();
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
      (window as any).bootstrap.Modal.getOrCreateInstance(document.getElementById('modal-report')).hide();
      this.resetForm();
    } else {
      (window as any).bootstrap.Modal.getOrCreateInstance(document.getElementById('modal-delete')).hide();
      this.deleteId = null;
    }
  }

  resetForm() {
    this.form.reset();
    this.selectedPost = null;
    this.currentImageUrl = null;
    this.selectedTags = [];
    this.imageFile = undefined;
    this.attachmentFile = undefined;
    this.attachmentKbFile = undefined;
    this.attachmentPdfFile = undefined;
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = false;
  }

  getTagNames(tagIds: number[]): string {
    return this.tags.filter(t => tagIds.includes(t.id)).map(t => t.name).join(', ');
  }

  get filteredPosts(): Post[] {
    if (!this.searchTerm.trim()) return this.posts;
    const term = this.searchTerm.toLowerCase();
    return this.posts.filter(post =>
      post.title.toLowerCase().includes(term) ||
      post.author.toLowerCase().includes(term) ||
      (post.category?.name?.toLowerCase().includes(term) ?? false)
    );
  }
  
  get paginatedPosts(): Post[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredPosts.slice(startIndex, startIndex + this.pageSize);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredPosts.length / this.pageSize);
  }
  
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}