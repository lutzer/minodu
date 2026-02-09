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
export class PartnersService {
  constructor(private http: HttpClient) { }

  getPartners(): Observable<any> {
    return this.http.get(`${API_URL}partners`, httpOptions);
  }

  getPartner(id: string): Observable<any> {
    return this.http.get(`${API_URL}partners/${id}`, httpOptions);
  }

  addPartner(name: string, adresse: string, phone: string): Observable<any> {
    return this.http.post(`${API_URL}partners`, { name, adresse, phone }, httpOptions);
  }

  updatePartner(id: number, name: string, adresse: string, phone: string): Observable<any> {
    return this.http.patch(`${API_URL}partners/${id}`, { name, adresse, phone }, httpOptions);
  }

  deletePartner(id: number): Observable<any> {
    return this.http.delete(`${API_URL}partners/${id}`, httpOptions);
  }
}