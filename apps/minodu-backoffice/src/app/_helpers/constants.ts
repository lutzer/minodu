import { environment } from '../../env/environment';

// Constante pour l'URL de l'API
export const APP_DOMAIN = environment.apiUrl;
export const API_URL = APP_DOMAIN+'/v1/';
export const COOKIE_DOMAIN = environment.cookieDomain;

export const CONTENT_TYPE = { 'Content-Type': 'application/json' };
export const TOKEN_KEY = 'access_token';
