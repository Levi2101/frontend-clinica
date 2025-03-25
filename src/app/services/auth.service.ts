import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isBrowser = typeof window !== 'undefined';

  private TOKEN_KEY = 'token';
  private ROL_KEY = 'rol';

  guardarSesion(token: string, rol: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.ROL_KEY, rol);
    }
  }

  obtenerToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.TOKEN_KEY) : null;
  }

  obtenerRol(): string | null {
    return this.isBrowser ? localStorage.getItem(this.ROL_KEY) : null;
  }

  cerrarSesion(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.ROL_KEY);
    }
  }

  estaAutenticado(): boolean {
    return this.isBrowser && !!localStorage.getItem(this.TOKEN_KEY);
  }
}
