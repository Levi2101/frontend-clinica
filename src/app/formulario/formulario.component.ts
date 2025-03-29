import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-formulario',
  standalone: true,
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class FormularioComponent implements OnInit {
  citas: any[] = [];
  citaForm: FormGroup;
  isLoading = false;


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

    this.http.get<any[]>('https://backend-clinica-goay.onrender.com/api/mis-citas', { headers }).subscribe({
      next: (res) => this.citas = res,
      error: (err) => console.error('Error al obtener citas del usuario', err)
    });
  }

  agendarCita(): void {
    if (this.citaForm.invalid) return;

    const token = this.auth.obtenerToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.isLoading = true; // Mostrar el modal de carga

    this.http.post('https://backend-clinica-goay.onrender.com/api/citas', this.citaForm.value, { headers }).subscribe({
      next: () => {
        alert('Cita agendada exitosamente');
        this.citaForm.reset();
        this.obtenerMisCitas();
        this.isLoading = false; // Ocultar el modal de carga
      },
      error: (err) => console.error('Error al agendar cita', err)
    });
  }
}
