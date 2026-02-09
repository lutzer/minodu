import { Component, OnInit } from '@angular/core';
import { Post } from '../_models/posts';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DateUtilsService } from '../_helpers/dateutils.service';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from '../_helpers/loader.service';
import { UserService } from '../_services/users.service';
import { PostService } from '../_services/posts.service';
import { AuthService } from '../_services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { PostCategoriesService } from '../_services/post-categories.service';
import { TagsService } from '../_services/tags.service';
import { Tag } from '../_models/tags';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css'
})
export class PostDetailsComponent implements OnInit {
  errorMessage = '';
  loading: boolean = false;
  post: Post | null = null;
  selectedTags: number[] = []; // Pour gérer les tags sélectionnés

  // --- Ajout pour édition ---
  form!: FormGroup;
  formError: string = '';
  formSuccess: string = '';
  isSubmitting: boolean = false;
  categories: any[] = [];
  tagsList: any[] = [];
  imageFile: File | null = null;
  currentImageUrl: string | null = null;
  attachmentFile: File | null = null;
  attachmentKbFile: File | null = null;
  attachmentPdfFile: File | null = null;
  fileInputId: string = 'postImageInput';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dateUtilsService: DateUtilsService,
    public loaderService: LoaderService,
    private postService: PostService,
    private postCategoriesService: PostCategoriesService,
    private tagsService: TagsService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.postService.getPost(id!!).subscribe({
        next: data => {
          this.post = Post.fromJson(data);
          this.loading = false;
          this.initForm();
        },
        error: err => {
          this.loading = false;
          this.errorMessage = err.error.message;
          this.authService.logout();
        }
      });
    });
    this.loadCategories();
    this.loadTags();
  }

  initForm() {
    const tags = this.post?.tags?.map((t: any) => t.id) || [];
    this.selectedTags = tags;
    this.currentImageUrl = this.post?.image || null;
    this.form = this.fb.group({
      author: [this.post?.author || '', Validators.required],
      title: [this.post?.title || '', Validators.required],
      idCategory: [this.post?.category?.id || '', Validators.required],
      tags: [tags],
      description: [this.post?.description || '', Validators.required]
    });
    this.imageFile = null;
    this.attachmentFile = null;
    this.attachmentKbFile = null;
    this.attachmentPdfFile = null;
  }

  loadCategories() {
    this.postCategoriesService.getPostCategories().subscribe({
      next: data => this.categories = data,
      error: () => this.categories = []
    });
  }

  loadTags() {
    this.tagsService.getTags().subscribe({
      next: data => this.tagsList = data,
      error: () => this.tagsList = []
    });
  }

  onFileChange(event: any, type: string) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (type === 'image') {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
    if (type === 'attachment') this.attachmentFile = file;
    if (type === 'attachmentKb') this.attachmentKbFile = file;
    if (type === 'attachmentPdf') this.attachmentPdfFile = file;
  }

  submitForm() {
    if (this.form.invalid || !this.post) return;
    this.isSubmitting = true;
    this.formError = '';
    this.formSuccess = '';
    const formValue = this.form.value;
    const idCategoryNum = formValue.idCategory ? Number(formValue.idCategory) : null;
    if (idCategoryNum === null) {
      this.formError = "La catégorie est requise.";
      this.isSubmitting = false;
      return;
    }
    const tagsArr = formValue.tags || [];
    if (!tagsArr.length) {
      this.formError = "Au moins un tag est requis.";
      this.isSubmitting = false;
      return;
    }
    const tagsStr = tagsArr.join(',');
    this.postService.updatePost(
      this.post.id,
      formValue.author,
      formValue.title,
      formValue.description,
      idCategoryNum,
      tagsStr,
      this.imageFile || undefined,
      this.attachmentFile || undefined,
      this.attachmentKbFile || undefined,
      this.attachmentPdfFile || undefined,
      '' // resources, à adapter si besoin
    ).subscribe({
      next: () => {
        this.formSuccess = 'Publication modifiée avec succès.';
        this.isSubmitting = false;
        setTimeout(() => {
          this.closeModal();
          // Rafraîchir les détails
          this.reloadPost();
        }, 1200);
      },
      error: err => {
        this.formError = err?.error?.message || 'Erreur lors de la modification.';
        this.isSubmitting = false;
      }
    });
  }

  closeModal() {
    const modal = document.getElementById('modal-report');
    if (modal) {
      // @ts-ignore
      const bsModal = window.bootstrap.Modal.getInstance(modal);
      if (bsModal) bsModal.hide();
    }
    this.formError = '';
    this.formSuccess = '';
    this.isSubmitting = false;
  }

  reloadPost() {
    if (!this.post) return;
    this.loading = true;
    this.postService.getPost(String(this.post.id)).subscribe({
      next: data => {
        this.post = Post.fromJson(data);
        // Synchronise selectedTags et form tags après édition
        const tags = this.post?.tags?.map((t: any) => t.id) || [];
        this.selectedTags = tags;
        this.form.patchValue({ tags });
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  getSafeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  // --- Gestion tags modale édition ---
  toggleTag(tagId: number): void {
    const tags = this.form.value.tags || [];
    if (tags.includes(tagId)) {
      this.form.patchValue({ tags: tags.filter((id: number) => id !== tagId) });
    } else {
      this.form.patchValue({ tags: [...tags, tagId] });
    }
  }

  isTagSelected(tagId: number): boolean {
    return (this.form.value.tags || []).includes(tagId);
  }

  onTagChange(tagId: number, event: Event): void {
    this.toggleTag(tagId);
  }

  trackByTagId(index: number, tag: Tag): number {
    return tag.id;
  }

  // Méthode de téléchargement
  downloadPdf(): void {
    if (!this.post?.attachmentPdf) return;
    
    this.http.get(this.post.attachmentPdf, { responseType: 'blob' })
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${this.post?.title || 'document'}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Erreur lors du téléchargement:', error);
          alert('Erreur lors du téléchargement du fichier');
        }
      });
  }

}

