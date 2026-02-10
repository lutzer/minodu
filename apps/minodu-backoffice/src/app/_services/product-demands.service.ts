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
export class ProductDemandsService {
  constructor(private http: HttpClient) { }

  getProductDemands(): Observable<any> {
    return this.http.get(`${API_URL}product-demands`, httpOptions);
  }

  getProductDemand(id: string): Observable<any> {
    return this.http.get(`${API_URL}product-demands/${id}`, httpOptions);
  }

  getProductDemandsByPartner(partnerId: number): Observable<any> {
    return this.http.get(`${API_URL}product-demands/partner/${partnerId}`, httpOptions);
  }

  getProductDemandsByProduct(productId: number): Observable<any> {
    return this.http.get(`${API_URL}product-demands/product/${productId}`, httpOptions);
  }

  addProductDemand(quantity: number, partnerId: number, productId: number, deadline: string): Observable<any> {
    return this.http.post(`${API_URL}product-demands`, { quantity, partnerId, productId, deadline }, httpOptions);
  }

  // NOUVELLES MÉTHODES POUR L'ARCHIVAGE

  /**
   * Récupère toutes les demandes archivées
   */
  getArchivedProductDemands(): Observable<any> {
    return this.http.get(`${API_URL}product-demands/archived`);
  }

  /**
   * Archive une demande de produit
   * @param id - L'ID de la demande à archiver
   */
  archiveProductDemand(id: number): Observable<any> {
    return this.http.put(`${API_URL}product-demands/${id}/archive`, {});
  }

  /**
   * Désarchive une demande de produit
   * @param id - L'ID de la demande à désarchiver
   */
  unarchiveProductDemand(id: number): Observable<any> {
    return this.http.put(`${API_URL}product-demands/${id}/unarchive`, {});
  }

  updateProductDemand(id: number, quantity: number, partnerId: number, productId: number, deadline: string): Observable<any> {
    return this.http.patch(`${API_URL}product-demands/${id}`, { quantity, partnerId, productId, deadline }, httpOptions);
  }

  deleteProductDemand(id: number): Observable<any> {
    return this.http.delete(`${API_URL}product-demands/${id}`, httpOptions);
  }
}