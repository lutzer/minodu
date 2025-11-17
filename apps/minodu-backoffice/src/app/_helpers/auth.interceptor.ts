import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { LoaderService } from './loader.service';
import { CookieService } from 'ngx-cookie-service';
import { TOKEN_KEY } from './constants';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService, private authService: AuthService, private loadingService: LoaderService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    this.loadingService.showLoader();

    const accessToken = this.cookieService.get(TOKEN_KEY);

    if (accessToken && this.authService.isAuthenticated()) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return next.handle(req).pipe(
      finalize(() => {
          this.loadingService.hideLoader();
      })
    );
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS,
    useClass: HttpRequestInterceptor,
    multi: true 
  },
];