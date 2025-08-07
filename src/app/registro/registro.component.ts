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
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.validarPasswordIgual });
  }

  validarPasswordIgual(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirmPass = form.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { passwordMismatch: true };
  }

  registrar(): void {
    if (this.registroForm.invalid) return;

    const datos = {
      nombre: this.registroForm.value.nombre,
      fechaNacimiento: this.registroForm.value.fechaNacimiento,
      sexo: this.registroForm.value.sexo,
      email: this.registroForm.value.email,
      password: this.registroForm.value.password,
      rol: 'usuario'
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

        this.snackBar.open('¡Bienvenido a la clínica, ' + email + '!', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-bienvenida']
        });

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
