import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, CONTENT_TYPE } from '../_helpers/constants';

const httpOptions = {
  headers: new HttpHeaders(CONTENT_TYPE)
};

@Injectable({
  providedIn: 'root'
})

export class WeatherService {
  constructor(private http: HttpClient) { }

  getWeather() : Observable<any>{
    return this.http.get(API_URL + 'weather/current', 
      httpOptions
      );
  } 

  syncWeather(id: string): Observable<any> {
    return this.http.get(`${API_URL}weather/sync`, 
      httpOptions
      );
  }

}