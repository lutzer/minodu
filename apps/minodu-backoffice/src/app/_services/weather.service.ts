import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
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

  getWeatherCurrent() : Observable<any>{
    return this.http.get(API_URL + 'weather/current', 
      httpOptions
      );
  }

  getWeatherDownload(): Observable<HttpResponse<Blob>> {
    return this.http.get(
      API_URL + 'weather/download',
      {
        responseType: 'blob',
        observe: 'response'
      }
    ) as Observable<HttpResponse<Blob>>;
  }


  getWeather() : Observable<any>{
    return this.http.get(API_URL + 'weather/current', 
      httpOptions
      );
  }

  getWeatherHistory(limit: number = 10, offset: number = 0): Observable<any> {
    return this.http.get(`${API_URL}weather?limit=${limit}&offset=${offset}`, httpOptions);
  }

  syncWeatherManual(): Observable<any> {
    return this.http.post(`${API_URL}weather/sync-manual`, {}, httpOptions);
  }

  deleteWeatherById(id: number): Observable<any> {
    return this.http.delete(`${API_URL}weather/${id}`, httpOptions);
  }

  deleteAllWeatherHistory(): Observable<any> {
    return this.http.delete(`${API_URL}weather`, httpOptions);
  }

  syncWeather(id: string): Observable<any> {
    return this.http.get(`${API_URL}weather/sync`, 
      httpOptions
      );
  }

}