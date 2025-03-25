import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuario',
  standalone: true,
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class UsuarioComponent implements OnInit {
  citas: any[] = [];
  citaForm: FormGroup;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private fb: FormBuilder
  ) {
    this.citaForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      servicio: ['', Validators.required],
      comentarios: ['']
    });
  }

  ngOnInit(): void {
    this.obtenerMisCitas();
  }

  obtenerMisCitas(): void {
    const token = this.auth.obtenerToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>('http://localhost:5000/api/mis-citas', { headers }).subscribe({
      next: (res) => this.citas = res,
      error: (err) => console.error('Error al obtener citas del usuario', err)
    });
  }

  agendarCita(): void {
    if (this.citaForm.invalid) return;

    const token = this.auth.obtenerToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.post('http://localhost:5000/api/citas', this.citaForm.value, { headers }).subscribe({
      next: () => {
        alert('Cita agendada exitosamente');
        this.citaForm.reset();
        this.obtenerMisCitas();
      },
      error: (err) => console.error('Error al agendar cita', err)
    });
  }
}
