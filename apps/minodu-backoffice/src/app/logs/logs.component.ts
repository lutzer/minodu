import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogsService } from '../_services/logs.service';
import { DateUtilsService } from '../_helpers/dateutils.service';
import { LoaderService } from '../_helpers/loader.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css'
})
export class LogsComponent implements OnInit {
  logs: any[] = [];
  loading = false;
  loadingMore = false;
  errorMessage = '';
  successMessage = '';
  logsText = '';
  isClearing = false;
  activeTab: 'default' | 'error' | 'access' = 'default';
  currentLines: number = 500;
  readonly LINES_INCREMENT: number = 500;

  constructor(
    public dateUtilsService: DateUtilsService,
    public loaderService: LoaderService,
    private logsService: LogsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs() {
    this.loading = true;
    this.errorMessage = '';
    this.currentLines = 500; // Reset to default when switching tabs
    
    this.logsService.getNginxLogs(this.activeTab, this.currentLines).subscribe({
      next: data => {
        this.logsText = data || 'No logs available yet';
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors du chargement des logs';
        this.logsText = '';
        if (err.status === 401) this.authService.logout();
      }
    });
  }

  loadMoreLogs() {
    this.loadingMore = true;
    this.errorMessage = '';
    this.currentLines += this.LINES_INCREMENT;
    
    this.logsService.getNginxLogs(this.activeTab, this.currentLines).subscribe({
      next: data => {
        this.logsText = data || 'No logs available yet';
        this.loadingMore = false;
      },
      error: err => {
        this.loadingMore = false;
        this.errorMessage = err.error?.message || 'Erreur lors du chargement des logs supplémentaires';
        // Restore previous line count on error
        this.currentLines -= this.LINES_INCREMENT;
        if (err.status === 401) this.authService.logout();
      }
    });
  }

  switchTab(tab: 'default' | 'error' | 'access') {
    this.activeTab = tab;
    this.loadLogs();
  }

  confirmClearLogs(event?: Event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('clear-logs-modal');
    if (modal && (window as any).bootstrap) {
      (window as any).bootstrap.Modal.getOrCreateInstance(modal).show();
    }
  }

  clearLogs() {
    this.isClearing = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.logsService.clearLogs().subscribe({
      next: () => {
        this.successMessage = 'Logs vidés avec succès';
        this.logsText = '';
        this.isClearing = false;
        const modal = document.getElementById('clear-logs-modal');
        if (modal && (window as any).bootstrap) {
          (window as any).bootstrap.Modal.getOrCreateInstance(modal).hide();
        }
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: err => {
        this.isClearing = false;
        this.errorMessage = err.error?.message || 'Erreur lors du vidage des logs';
        if (err.status === 401) this.authService.logout();
      }
    });
  }

  downloadLogs(format: 'txt' | 'json') {
    const element = document.createElement('a');
    let content = this.logsText;
    let filename = '';
    let type = '';

    if (format === 'json') {
      content = JSON.stringify({ logs: this.logsText }, null, 2);
      filename = 'logs.json';
      type = 'application/json';
    } else {
      filename = 'logs.txt';
      type = 'text/plain';
    }

    element.setAttribute('href', 'data:' + type + ';charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
