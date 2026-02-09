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

  getNginxLogs(type: 'default' | 'error' | 'access' = 'default', lines: number = 500): Observable<any> {
    return this.http.get(`${API_URL}nginx-logs?type=${type}&lines=${lines}`, {
      ...httpOptions,
      responseType: 'text'
    });
  }

  clearLogs(): Observable<any> {
    return this.http.delete(`${API_URL}nginx-logs`, httpOptions);
  }
}

