import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, CONTENT_TYPE } from '../_helpers/constants';
import { ProductOffer } from '../_models/product-offers';

const httpOptions = {
  headers: new HttpHeaders(CONTENT_TYPE)
};

@Injectable({
  providedIn: 'root'
})
export class ProductOffersService {
  constructor(private http: HttpClient) { }

  getProductOffers(): Observable<any> {
    return this.http.get(`${API_URL}product-offers`, 
      httpOptions
    );
  }

  getProductOffer(id: number): Observable<any> {
    return this.http.get(`${API_URL}product-offers/${id}`, 
      httpOptions
    );
  }

  addProductOffer(productId: number, quantity: number, price: number, description: string): Observable<any> {
    return this.http.post(API_URL + 'product-offers', {
      product_id: productId,
      quantity: quantity,
      price: price,
      description: description
    }, httpOptions);
  }

  updateProductOffer(id: number, productId: number, quantity: number, price: number, description: string): Observable<any> {
    return this.http.patch(API_URL + 'product-offers/' + id, {
      product_id: productId,
      quantity: quantity,
      price: price,
      description: description
    }, httpOptions);
  }

  deleteProductOffer(id: number): Observable<any> {
    return this.http.delete(`${API_URL}product-offers/${id}`, httpOptions);
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${API_URL}product-offers/${id}/status`, { status }, httpOptions);
  }
}