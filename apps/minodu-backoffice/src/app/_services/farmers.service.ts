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
export class FarmersService {
  constructor(private http: HttpClient) { }

  getFarmers(): Observable<any> {
    return this.http.get(`${API_URL}users`, httpOptions);
  }
}
