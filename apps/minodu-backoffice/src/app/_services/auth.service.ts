import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { API_URL, CONTENT_TYPE, COOKIE_DOMAIN, TOKEN_KEY } from '../_helpers/constants';
import { CookieService } from 'ngx-cookie-service';

// Options pour les requêtes HTTP
const httpOptions = {
  headers: new HttpHeaders(CONTENT_TYPE)
};

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(
    private http: HttpClient, 
    private router: Router, 
    private cookieService: CookieService) {

   }

  register(usertype: string, lastname: string, firstname: string, email: string, password: string ) : Observable<any>{
    return this.http.post(API_URL + 'auth/signup',
    {
      "userType" : usertype,
      "firstName" : firstname,
      "lastName" : lastname,
      "email" : email,
      "password" : password,
      },
      httpOptions
      );
  }

  login(phone: string, password: string): Observable<any> {
    return this.http.post(API_URL + 'auth/signin', 
    {
      "phone" : phone,
      "password" : password
      },
      httpOptions
      );
  }

  resetPassword(token: string, password: string): Observable<any> {
    // console.log(API_URL)
    return this.http.post(`${API_URL}auth/reset-password/${token}`, 
    {
      "password" : password
    },
    httpOptions
    );
  }

  getUser(): Observable<any> {
    return this.http.get(`${API_URL}users/current`, 
      httpOptions
      );
  }

  changePassword(password: string): Observable<any> {
    return this.http.put(`${API_URL}users/password`,
    {
      "password": password
    },
    httpOptions
    );
  }

  logout() {
    this.cookieService.deleteAll('/', COOKIE_DOMAIN);       
    window.location.href="/login"
  }

  public isAuthenticated() : boolean {
    if (!this.cookieService.check(TOKEN_KEY))
      return false;
    const token = this.cookieService.get(TOKEN_KEY);
    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(token);
    if(isExpired)
    this.cookieService.deleteAll();
    return !isExpired;
  }

}