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
    weatherHistory: Weather[] = [];
    selectedWeather: Weather | null = null;
    currentPage: number = 1;
    pageSize: number = 10;
    loadingMore: boolean = false;
    totalLoadedItems: number = 0;
    hasMoreData: boolean = true;
    Math = Math; // Pour utiliser Math dans le template

    constructor(private router: Router, 
                public dateUtilsService: DateUtilsService, 
                public loaderService: LoaderService, 
                private weatherService: WeatherService, 
                private authService: AuthService){}
  
  ngOnInit(): void {
    this.loadCurrentWeather();
    this.loadWeatherHistory();
  }

  syncWeatherManually() {
    this.syncing = true;
    this.syncMessage = 'Synchronisation en cours...';
    this.syncError = false;
    
    this.weatherService.syncWeatherManual().subscribe({
      next: (data) => {
        this.syncing = false;
        this.syncMessage = 'Synchronisation réussie!';
        this.syncError = false;
        // console.log('Weather sync successful:', data);
        
        // Reload weather data
        this.loadCurrentWeather();
        this.loadWeatherHistory();
        
        // Clear message after 3 seconds
        setTimeout(() => {
          this.syncMessage = '';
        }, 3000);
      },
      error: (err) => {
        this.syncing = false;
        this.syncMessage = 'Erreur lors de la synchronisation: ' + (err.error?.message || err.message);
        this.syncError = true;
        // console.log('Weather sync error:', err);
        
        // Clear message after 5 seconds
        setTimeout(() => {
          this.syncMessage = '';
        }, 5000);
      }
    });
  }

  loadCurrentWeather() {
    this.weatherService.getWeatherCurrent().subscribe({
      next: data => {
        this.weather = Weather.fromJson(data[0]);
        this.loading = false;
        // console.log(this.weather)
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error.message;
        // console.log(err.error)
        this.authService.logout();
      }
    });
  }

  downloadWeatherData() {
    this.weatherService.getWeatherDownload().subscribe({
      next: (response: any) => {
        const blob = response.body;
        if (!blob) return;

        // Extraire le nom du fichier depuis le header Content-Disposition du backend
        let fileName = 'weather-data';
        const contentDisposition = response.headers?.get('content-disposition');
        if (contentDisposition) {
          // Gérer les formats: filename="nom" ou filename*=UTF-8''nom
          const matches = contentDisposition.match(
            /filename\*=(?:UTF-8'')?([^;]+)|filename="?([^"_;]+)"?/
          );
          if (matches) {
            fileName = decodeURIComponent(matches[1] || matches[2]);
          }
        }

        // Créer l'objet URL et déclencher le téléchargement
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: err => {
        // console.error('Erreur téléchargement:', err);
        this.errorMessage =
          err?.error?.message || 'Erreur lors du téléchargement';
      }
    });
  }



  loadWeatherHistory() {
    this.loadingMore = true;
    const offset = this.weatherHistory.length;
    
    this.weatherService.getWeatherHistory(this.pageSize, offset).subscribe({
      next: data => {
        if (data && data.length > 0) {
          const newWeathers = data.map((w: any) => Weather.fromJson(w)).reverse();
          this.weatherHistory = [...this.weatherHistory, ...newWeathers];
          this.totalLoadedItems += data.length;
          
          // Si on reçoit moins d'éléments que demandé, c'est qu'on a atteint la fin
          if (data.length < this.pageSize) {
            this.hasMoreData = false;
          }
        } else {
          this.hasMoreData = false;
        }
        this.loadingMore = false;
      },
      error: err => {
        // console.log('Error loading weather history', err);
        this.hasMoreData = false;
        this.loadingMore = false;
      }
    });
  }

  get paginatedWeatherHistory(): Weather[] {
    return this.weatherHistory;
  }

  get totalPages(): number {
    return Math.ceil(this.totalLoadedItems / this.pageSize);
  }

  loadMore() {
    if (this.hasMoreData && !this.loadingMore) {
      this.loadWeatherHistory();
    }
  }

  viewWeatherDetail(weather: Weather, event?: Event) {
    if (event) event.preventDefault();
    this.selectedWeather = weather;
    (window as any).bootstrap.Modal.getOrCreateInstance(
      document.getElementById('view-weather-modal')
    ).show();
  }

  closeViewModal(event?: Event) {
    if (event) event.preventDefault();
    (window as any).bootstrap.Modal.getOrCreateInstance(
      document.getElementById('view-weather-modal')
    ).hide();
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

  // downloadWeatherData(format: 'csv' | 'json') {
  //   const element = document.createElement('a');
  //   let content = '';
  //   let filename = '';
  //   let type = '';

  //   if (format === 'json') {
  //     content = JSON.stringify(this.weatherHistory, null, 2);
  //     filename = 'historique_meteo.json';
  //     type = 'application/json';
  //   } else {
  //     // CSV format
  //     const headers = ['Date', 'Température', 'Température ressentie', 'Humidité', 'Humidité 2', 'Pression', 'Luminosité', 'Ambiant', 'CO', 'NO₂', 'Description'];
  //     const rows = this.weatherHistory.map(w => [
  //       w.createdAt || '',
  //       w.temperature || '',
  //       w.temperature1 || '',
  //       w.humidity || '',
  //       w.humidity1 || '',
  //       w.pressure || '',
  //       w.luminosity || '',
  //       w.ambient || '',
  //       w.co || '',
  //       w.no2 || '',
  //       (w.description || '').replace(/"/g, '""')
  //     ]);

  //     content = [headers, ...rows].map(row => 
  //       row.map(cell => typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell).join(',')
  //     ).join('\n');
      
  //     filename = 'historique_meteo.csv';
  //     type = 'text/csv;charset=utf-8;';
  //   }

  //   element.setAttribute('href', 'data:' + type + ',' + encodeURIComponent(content));
  //   element.setAttribute('download', filename);
  //   element.style.display = 'none';
  //   document.body.appendChild(element);
  //   element.click();
  //   document.body.removeChild(element);
  // }
}
