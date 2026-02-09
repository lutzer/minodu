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

export class ProductAvailabilitiesService {
  constructor(private http: HttpClient) { }

  getProductAvailabilities(): Observable<any> {
    return this.http.get(`${API_URL}product-offers`, httpOptions);
  }

  getProductAvailability(id: string): Observable<any> {
    return this.http.get(`${API_URL}product-offers/${id}`, httpOptions);
  }

  addProductAvailability(quantity: number, farmerId: number, productId: number): Observable<any> {
    return this.http.post(`${API_URL}product-offers`, { quantity, farmerId, productId }, httpOptions);
  }

  // NOUVELLES MÉTHODES POUR L'ARCHIVAGE

  /**
   * Récupère toutes les disponibilités archivées
   */
  getArchivedProductAvailabilities(): Observable<any> {
    return this.http.get(`${API_URL}product-offers/archived`);
  }

  /**
   * Archive une disponibilité de produit
   * @param id - L'ID de la disponibilité à archiver
   */
  archiveProductAvailability(id: number): Observable<any> {
    return this.http.put(`${API_URL}product-offers/archive/${id}`, {});
  }

  /**
   * Désarchive une disponibilité de produit
   * @param id - L'ID de la disponibilité à désarchiver
   */
  unarchiveProductAvailability(id: number): Observable<any> {
    return this.http.put(`${API_URL}product-offers/unarchive/${id}`, {});
  }

  updateProductAvailability(id: number, quantity: number, farmerId: number, productId: number): Observable<any> {
    return this.http.patch(`${API_URL}product-offers/${id}`, { quantity, farmerId, productId }, httpOptions);
  }

  deleteProductAvailability(id: number): Observable<any> {
    return this.http.delete(`${API_URL}product-offers/${id}`, httpOptions);
  }
}
