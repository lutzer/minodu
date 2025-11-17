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

export class PostService {
  constructor(private http: HttpClient) { }

  getPostCategories() : Observable<any>{
    return this.http.get(`${API_URL}post-categories`, 
      httpOptions
      );
  }

  getPostTags() : Observable<any>{
    return this.http.get(`${API_URL}tags`, 
      httpOptions
      );
  }

  getPosts() : Observable<any>{
    return this.http.get(`${API_URL}posts`, 
      httpOptions
      );
  }

  getPost(id: string): Observable<any> {
    return this.http.get(`${API_URL}posts/${id}`, 
      httpOptions
      );
  }

  // addProduct(name: string, description: string, category: string, price: string, salesUnit: string, image: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('name', name);
  //   formData.append('description', description);
  //   formData.append('categoryId', category);
  //   formData.append('price', price);
  //   formData.append('sales_unit', salesUnit);
  //   if(image)
  //   formData.append('image', image, image.name);
  //   return this.http.post(API_URL + 'products', formData);
  // }

  addPost(name: string, description: string, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if(image)
    formData.append('image', image, image.name);
    return this.http.post(API_URL + 'posts', formData);
  }

}
