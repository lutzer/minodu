import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Forum } from '../_models/forum';
import { ForumService } from '../_services/forum.service';
import { DateUtilsService } from '../_helpers/dateutils.service';
import { LoaderService } from '../_helpers/loader.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css'
})
export class ForumComponent implements OnInit {
  forumPosts: Forum[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  deleteId: number | null = null;
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  Math = Math; // Pour utiliser Math dans le template
  selectedPost: Forum | null = null;

  constructor(
    public dateUtilsService: DateUtilsService,
    public loaderService: LoaderService,
    private forumService: ForumService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadForum();
  }

  loadForum() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.forumService.getForums().subscribe({
      next: data => {
        this.forumPosts = data;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors du chargement du forum';
        if (err.status === 401) this.authService.logout();
      }
    });
  }

  get filteredPosts(): Forum[] {
    return this.forumPosts.filter(post =>
      post.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (post.author?.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false)
    );
  }

  get paginatedPosts(): Forum[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredPosts.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPosts.length / this.pageSize);
  }

  confirmDelete(id: number, event?: Event) {
    if (event) event.preventDefault();
    this.deleteId = id;
    (window as any).bootstrap.Modal.getOrCreateInstance(
      document.getElementById('delete-modal')
    ).show();
  }

  viewForum(post: Forum, event?: Event) {
    if (event) event.preventDefault();
    this.selectedPost = post;
    (window as any).bootstrap.Modal.getOrCreateInstance(
      document.getElementById('view-forum-modal')
    ).show();
  }

  isAudio(file: { filename: string; content_type: string }): boolean {
    const audioExtensions = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'];
    const ext = file.filename?.split('.')?.pop()?.toLowerCase() || '';
    return audioExtensions.includes(ext);
  }

  isImage(file: { filename: string; content_type: string }): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const ext = file.filename?.split('.')?.pop()?.toLowerCase() || '';
    return imageExtensions.includes(ext);
  }

  closeViewModal(event?: Event) {
    if (event) event.preventDefault();
    (window as any).bootstrap.Modal.getOrCreateInstance(
      document.getElementById('view-forum-modal')
    ).hide();
    this.selectedPost = null;
  }

  deleteFromModal() {
    if (this.selectedPost) {
      this.deleteId = this.selectedPost.id;
      this.closeViewModal();
      (window as any).bootstrap.Modal.getOrCreateInstance(
        document.getElementById('delete-modal')
      ).show();
    }
  }

  deletePost() {
    if (this.deleteId === null) return;

    this.forumService.deleteForum(this.deleteId).subscribe({
      next: () => {
        this.successMessage = 'Entrée du forum supprimée avec succès';
        this.loadForum();
        (window as any).bootstrap.Modal.getOrCreateInstance(
          document.getElementById('delete-modal')
        ).hide();
        this.deleteId = null;
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Erreur lors de la suppression';
        if (err.status === 401) this.authService.logout();
      }
    });
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
