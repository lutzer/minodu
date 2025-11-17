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

export class ConfigurationService {
  constructor(private http: HttpClient) { }

  getConfiguration() : Observable<any>{
    return this.http.get(API_URL + 'config', 
      httpOptions
      );
  }

  updateConfiguration(name: string, location: string, address: string, whatsappLink: string, stationLink: string, description: string): Observable<any> {
    return this.http.patch(API_URL + 'config', 
      {
      "name" : name,
      "location" : location,
      "adresse" : address,
      "whatsappLink" : whatsappLink,
      "stationLink" : stationLink,
      "intro" : description
      },
      httpOptions
      );
  }

}