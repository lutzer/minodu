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
export class LogsService {
  constructor(private http: HttpClient) { }

  getNginxLogs(type: 'default' | 'error' | 'access' = 'default', lines: number = 500, source: 'frontend' | 'backend' | 'rag' = 'frontend'): Observable<any> {
    let endpoint = `nginx-logs`;
    if (source === 'backend') {
      endpoint = `backend-logs`;
    } else if (source === 'rag') {
      endpoint = `rag-logs`;
    }
    return this.http.get(`${API_URL}${endpoint}?type=${type}&lines=${lines}`, {
      ...httpOptions,
      responseType: 'text'
    });
  }

  clearLogs(source: 'backend' | 'frontend' | 'rag' = 'backend'): Observable<any> {
    let endpoint = `nginx-logs`;
    if (source === 'backend') {
      endpoint = `backend-logs`;
    } else if (source === 'rag') {
      endpoint = `rag-logs`;
    }
    return this.http.delete(`${API_URL}${endpoint}`, httpOptions);
  }
  }


