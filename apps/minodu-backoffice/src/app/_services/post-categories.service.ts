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
export class PostCategoriesService {
  constructor(private http: HttpClient) { }

  getPostCategories(): Observable<any> {
    return this.http.get(`${API_URL}post-categories`, httpOptions);
  }

  getPostCategory(id: number): Observable<any> {
    return this.http.get(`${API_URL}post-categories/${id}`, httpOptions);
  }

  addPostCategory(name: string, nameKb: string, image?: File): Observable<any> {
    if (image) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('nameKb', nameKb);
      formData.append('image', image, image.name);
      return this.http.post(`${API_URL}post-categories`, formData);
    }
    return this.http.post(`${API_URL}post-categories`, { name, nameKb }, httpOptions);
  }

  updatePostCategory(id: number, name: string, nameKb: string, image?: File): Observable<any> {
    if (image) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('nameKb', nameKb);
      formData.append('image', image, image.name);
      return this.http.patch(`${API_URL}post-categories/${id}`, formData);
    }
    return this.http.patch(`${API_URL}post-categories/${id}`, { name, nameKb }, httpOptions);
  }

  deletePostCategory(id: number): Observable<any> {
    return this.http.delete(`${API_URL}post-categories/${id}`, httpOptions);
  }
}
