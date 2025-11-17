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

export class UserService {
  constructor(private http: HttpClient) { }

  getUsers() : Observable<any>{
    return this.http.get(API_URL + 'users', 
      httpOptions
      );
  }

  getUserDetails(): Observable<any> {
    return this.http.get(`${API_URL}users/current`, 
      httpOptions
      );
  }

  getUser(id: string): Observable<any> {
    return this.http.get(`${API_URL}users/${id}`, 
      httpOptions
      );
  }

  getUserDashboard() : Observable<any>{
    return this.http.get(`${API_URL}users/dashboard`, 
      httpOptions
      );
  }

  changePassword(oldPassword: string, newPassword: string) : Observable<any>{
    return this.http.patch(API_URL + 'users/password', 
      {"oldPassword": oldPassword, "newPassword": newPassword},
      httpOptions
      );
  }
  
  changePersonalInfo(firstName: string, lastName: string, profession: string, phone: string, sex: string) : Observable<any>{
    return this.http.patch(API_URL + 'users/personal-info', 
      {"firstName": firstName,
      "lastName": lastName,
      "profession": profession,
      "phone": phone,
      "sex": sex},
      httpOptions
      );
  }

}