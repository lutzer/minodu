import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Weather } from '../_models/weather';
import { Router } from '@angular/router';
import { DateUtilsService } from '../_helpers/dateutils.service';
import { LoaderService } from '../_helpers/loader.service';
import { WeatherService } from '../_services/weather.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent implements OnInit {
  errorMessage = '';
  loading: boolean = false;
  syncing: boolean = false;
  syncMessage: string = '';
  syncError: boolean = false;
  weather: Weather | null = null;

  // Toutes les données chargées une seule fois
  weatherHistory: Weather[] = [];

  selectedWeather: Weather | null = null;
  Math = Math;

  // Pagination frontend
  currentPage: number = 1;
  readonly pageSize: number = 10;

  constructor(
    private router: Router,
    public dateUtilsService: DateUtilsService,
    public loaderService: LoaderService,
    private weatherService: WeatherService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentWeather();
    this.loadWeatherHistory();
  }

  // ─── Données ───────────────────────────────────────────────────────────────

  loadCurrentWeather() {
    this.weatherService.getWeatherCurrent().subscribe({
      next: data => {
        this.weather = Weather.fromJson(data[0]);
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error.message;
        this.authService.logout();
      }
    });
  }

  loadWeatherHistory() {
    this.loading = true;
    this.weatherService.getWeatherHistory().subscribe({
      next: data => {
        this.weatherHistory = (data || []).map((w: any) => Weather.fromJson(w)).reverse();
        this.currentPage = 1;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
      }
    });
  }

  // ─── Pagination ────────────────────────────────────────────────────────────

  get totalPages(): number {
    return Math.ceil(this.weatherHistory.length / this.pageSize);
  }

  get paginatedWeatherHistory(): Weather[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.weatherHistory.slice(start, start + this.pageSize);
  }

  // Génère les numéros de pages à afficher (avec ellipses gérées dans le HTML)
  get pages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    const pages: number[] = [];
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  // ─── Modal détail ──────────────────────────────────────────────────────────

  viewWeatherDetail(weather: Weather, event?: Event) {
    if (event) event.preventDefault();
    this.selectedWeather = weather;
    // Ouverture via data-bs-toggle dans le HTML
  }

  closeViewModal(event?: Event) {
    if (event) event.preventDefault();
    this.selectedWeather = null;
    const modal = document.getElementById('view-weather-modal');
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    }
  }

  // ─── Sync & Download ───────────────────────────────────────────────────────

  syncWeatherManually() {
    this.syncing = true;
    this.syncMessage = 'Synchronisation en cours...';
    this.syncError = false;

    this.weatherService.syncWeatherManual().subscribe({
      next: () => {
        this.syncing = false;
        this.syncMessage = 'Synchronisation réussie!';
        this.syncError = false;
        this.loadCurrentWeather();
        this.loadWeatherHistory();
        setTimeout(() => { this.syncMessage = ''; }, 3000);
      },
      error: (err) => {
        this.syncing = false;
        this.syncMessage = 'Erreur lors de la synchronisation: ' + (err.error?.message || err.message);
        this.syncError = true;
        setTimeout(() => { this.syncMessage = ''; }, 5000);
      }
    });
  }

  downloadWeatherData() {
    this.weatherService.getWeatherDownload().subscribe({
      next: (response: any) => {
        const blob = response.body;
        if (!blob) return;
        let fileName = 'weather-data';
        const contentDisposition = response.headers?.get('content-disposition');
        if (contentDisposition) {
          const matches = contentDisposition.match(
            /filename\*=(?:UTF-8'')?([^;]+)|filename="?([^"_;]+)"?/
          );
          if (matches) fileName = decodeURIComponent(matches[1] || matches[2]);
        }
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none;'
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: err => {
        this.errorMessage = err?.error?.message || 'Erreur lors du téléchargement';
      }
    });
  }
}