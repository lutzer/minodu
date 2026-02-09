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
export class TagsService {
  constructor(private http: HttpClient) { }

  getTags(): Observable<any> {
    return this.http.get(`${API_URL}tags`, httpOptions);
  }

  getTag(id: number): Observable<any> {
    return this.http.get(`${API_URL}tags/${id}`, httpOptions);
  }

  addTag(name: string, image?: File): Observable<any> {
    if (image) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('image', image, image.name);
      return this.http.post(`${API_URL}tags`, formData);
    }
    return this.http.post(`${API_URL}tags`, { name });
  }

  updateTag(id: number, name: string, image?: File): Observable<any> {
    if (image) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('image', image, image.name);
      return this.http.patch(`${API_URL}tags/${id}`, formData);
    }
    return this.http.patch(`${API_URL}tags/${id}`, { name }, httpOptions);
  }

  deleteTag(id: number): Observable<any> {
    return this.http.delete(`${API_URL}tags/${id}`, httpOptions);
  }
}
