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

export class ProductCategoriesService {
  constructor(private http: HttpClient) { }

  getProductCategories() : Observable<any>{
    return this.http.get(`${API_URL}product-categories`, 
      httpOptions
      );
  }

  getProductCategory(id: string): Observable<any> {
    return this.http.get(`${API_URL}product-categories/${id}`, 
      httpOptions
      );
  }

  addCategory(name: string, image: File | null): Observable<any> {
    if (image) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('image', image);
      return this.http.post(`${API_URL}product-categories`, formData);
    } else {
      return this.http.post(`${API_URL}product-categories`, { name });
    }
  }

  updateCategory(id: number, name: string, image: File | null): Observable<any> {
    if (image) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('image', image, image.name);
      return this.http.patch(`${API_URL}product-categories/${id}`, formData);
    } else {
      return this.http.patch(`${API_URL}product-categories/${id}`, { name }, httpOptions);
    }
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${API_URL}product-categories/${id}`, 
      httpOptions
      );
  }

}
