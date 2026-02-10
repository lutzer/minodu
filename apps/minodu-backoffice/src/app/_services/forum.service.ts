import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Forum } from '../_models/forum';
import { environment } from '../../env/environment';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private apiUrl = `${environment.apiUrl}/v1/forum`;

  constructor(private http: HttpClient) {}

  getForums(): Observable<Forum[]> {
    return this.http.get<Forum[]>(this.apiUrl);
  }

  getForumById(id: number): Observable<Forum> {
    return this.http.get<Forum>(`${this.apiUrl}/${id}`);
  }

  getPublishedForums(): Observable<Forum[]> {
    return this.http.get<Forum[]>(`${this.apiUrl}/published`);
  }

  createForum(forum: FormData | Partial<Forum>): Observable<Forum> {
    return this.http.post<Forum>(this.apiUrl, forum);
  }

  updateForum(id: number, forum: FormData | Partial<Forum>): Observable<Forum> {
    return this.http.patch<Forum>(`${this.apiUrl}/${id}`, forum);
  }

  deleteForum(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
