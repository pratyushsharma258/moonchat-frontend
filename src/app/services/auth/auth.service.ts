import { Injectable } from '@angular/core';
import * as Cookies from 'js-cookie';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   setToken(token: string): void {
    Cookies.default.set('authToken', token);
  }

  getToken(): string | undefined {
    return Cookies.default.get('authToken');
  }

  clearToken(): void {
    Cookies.default.remove('authToken');
  }
}
