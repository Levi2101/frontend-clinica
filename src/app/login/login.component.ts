// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
imports: [CommonModule, ReactiveFormsModule, RouterModule]

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const loginData = this.loginForm.value;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<any>('https://backend-clinica-goay.onrender.com/api/login', loginData, { headers }).subscribe({
      next: (res) => {
        const token = res.token;

        // Decodificar el token para extraer el rol
        const payload = JSON.parse(atob(token.split('.')[1]));
        const rol = payload.rol;

        // Guardar token y rol
        this.authService.guardarSesion(token, rol);

        // Redirigir según el rol
        if (rol === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/usuario']);
        }
      },
      error: (err) => {
        this.errorMsg = 'Credenciales inválidas';
        console.error(err);
      }
    });
  }
}
