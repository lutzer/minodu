// Service PostService amélioré pour gérer les deux fichiers audio

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

  getPostCategories(): Observable<any> {
    return this.http.get(`${API_URL}post-categories`, httpOptions);
  }

  getPostTags(): Observable<any> {
    return this.http.get(`${API_URL}tags`, httpOptions);
  }

  getPosts(): Observable<any> {
    return this.http.get(`${API_URL}posts`, httpOptions);
  }

  getPost(id: string): Observable<any> {
    return this.http.get(`${API_URL}posts/${id}`, httpOptions);
  }

  addPost(
    author: string, 
    title: string, 
    description: string, 
    idCategory: number, 
    tags: string, 
    image?: File, 
    attachment?: File,        // Audio français
    attachmentKb?: File,  // Audio kabyé (fichier)
    attachmentPdf?: File, // Fichier PDF
    resources?: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('author', author ?? '');
    formData.append('title', title ?? '');
    formData.append('description', description ?? '');
    formData.append('idCategory', idCategory !== undefined && idCategory !== null ? String(idCategory) : '');
    formData.append('tags', tags ?? '');
    formData.append('resources', resources ?? '');
    if (image) formData.append('image', image, image.name);
    else formData.append('image', '');
    if (attachment) formData.append('attachment', attachment, attachment.name);
    else formData.append('attachment', '');
    if (attachmentKb) formData.append('attachmentKb', attachmentKb, attachmentKb.name);
    else formData.append('attachmentKb', '');
    if (attachmentPdf) formData.append('attachmentPdf', attachmentPdf, attachmentPdf.name);
    else formData.append('attachmentPdf', '');
    return this.http.post(`${API_URL}posts`, formData);
  }

  updatePost(
    id: number,
    author: string, 
    title: string, 
    description: string, 
    idCategory: number, 
    tags: string, 
    image?: File, 
    attachment?: File,        // Audio français
    attachmentKb?: File,  // Audio kabyé (fichier)
    attachmentPdf?: File, // Fichier PDF
    resources?: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('author', author ?? '');
    formData.append('title', title ?? '');
    formData.append('description', description ?? '');
    formData.append('idCategory', idCategory !== undefined && idCategory !== null ? String(idCategory) : '');
    formData.append('tags', tags ?? '');
    formData.append('resources', resources ?? '');
    if (image) formData.append('image', image, image.name);
    else formData.append('image', '');
    if (attachment) formData.append('attachment', attachment, attachment.name);
    else formData.append('attachment', '');
    if (attachmentKb) formData.append('attachmentKb', attachmentKb, attachmentKb.name);
    else formData.append('attachmentKb', '');
    if (attachmentPdf) formData.append('attachmentPdf', attachmentPdf, attachmentPdf.name);
    else formData.append('attachmentPdf', '');
    return this.http.patch(`${API_URL}posts/${id}`, formData);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${API_URL}posts/${id}`, httpOptions);
  }
}