import { Component, OnInit } from '@angular/core';
import { Weather } from '../_models/weather';
import { Router } from '@angular/router';
import { DateUtilsService } from '../_helpers/dateutils.service';
import { LoaderService } from '../_helpers/loader.service';
import { WeatherService } from '../_services/weather.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent implements OnInit {
    errorMessage = '';
    loading: boolean = false;
    weather: Weather | null = null;

    constructor(private router: Router, public dateUtilsService: DateUtilsService, public loaderService: LoaderService, private weatherService: WeatherService, private authService: AuthService){}
  
  ngOnInit(): void {
    this.weatherService.getWeather().subscribe({
          next: data => {
            this.weather = Weather.fromJson(data[0]);
            this.loading = false;
            console.log(this.weather)
          },
          error: err => {
            this.loading = false;
            this.errorMessage = err.error.message;
            console.log(err.error)
            this.authService.logout();
          }
        });
  }
}
