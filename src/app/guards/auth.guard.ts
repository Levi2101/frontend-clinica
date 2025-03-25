import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const rolEsperado = route.data['rol'];
    const token = this.auth.obtenerToken();
    const rol = this.auth.obtenerRol();

    if (!token || !rol || rol !== rolEsperado) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
