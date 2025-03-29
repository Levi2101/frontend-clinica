import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registro',
  standalone: true,
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatSnackBarModule
  ]
})
export class RegistroComponent {
  registroForm: FormGroup;
  mensaje: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.registroForm = this.fb.group({
      /*email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]*/
    });
  }

  registrar(): void {
    if (this.registroForm.invalid) return;

    const datos = {
      email: this.registroForm.value.email,
      password: this.registroForm.value.password,
      rol: 'usuario' // opcional, por si el backend ya lo asigna
    };

    this.http.post('http://127.0.0.1:10000/api/register', datos).subscribe({
      next: () => {
        this.loginDespuesDeRegistrar(datos.email, datos.password);
      },
      error: (err) => {
        this.mensaje = err.error?.error || 'Error al registrar';
      }
    });
  }

  loginDespuesDeRegistrar(email: string, password: string) {
    const loginData = { email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<any>('http://127.0.0.1:10000/api/login', loginData, { headers }).subscribe({
      next: (res) => {
        const token = res.token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const rol = payload.rol;

        this.auth.guardarSesion(token, rol);

        // ✅ SnackBar de bienvenida
        this.snackBar.open('¡Bienvenido a la clínica, ' + email + '!', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-bienvenida']
        });

        // ✅ Redirigir por rol
        if (rol === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: () => {
        this.mensaje = 'Usuario registrado, pero error al iniciar sesión';
      }
    });
  }
}
