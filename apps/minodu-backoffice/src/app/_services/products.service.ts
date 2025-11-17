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

export class ProductsService {
  constructor(private http: HttpClient) { }

  getProducts() : Observable<any>{
    return this.http.get(`${API_URL}products`, 
      httpOptions
      );
  }

  getProduct(id: string): Observable<any> {
    return this.http.get(`${API_URL}products/${id}`, 
      httpOptions
      );
  }

  addProduct(name: string, description: string, category: string, price: string, salesUnit: string, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('categoryId', category);
    formData.append('price', price);
    formData.append('sales_unit', salesUnit);
    if(image)
    formData.append('image', image, image.name);
    return this.http.post(API_URL + 'products', formData);
  }
}
