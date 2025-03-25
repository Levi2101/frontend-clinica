import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CitaService } from '../services/cita.service';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
})
export class AgendaComponent implements OnInit {
  citaForm: FormGroup;
  citas: any[] = [];

  constructor(private fb: FormBuilder, private citaService: CitaService) {
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
    this.obtenerCitas();
  }

  onSubmit(): void {
    if (this.citaForm.valid) {
      this.citaService.agendarCita(this.citaForm.value).subscribe({
        next: (res) => {
          alert('Cita agendada exitosamente');
          this.citaForm.reset();
          this.obtenerCitas();
        },
        error: (err) => {
          console.error('Error al agendar cita:', err);
        }
      });
    }
  }

  obtenerCitas(): void {
    this.citaService.obtenerCitas().subscribe({
      next: (res) => {
        this.citas = res;
      },
      error: (err) => {
        console.error('Error al obtener citas:', err);
      }
    });
  }

  eliminarCita(id: string): void {
    if (confirm('¿Estás seguro de eliminar esta cita?')) {
      this.citaService.eliminarCita(id).subscribe({
        next: (res) => {
          alert('Cita eliminada');
          this.obtenerCitas();
        },
        error: (err) => {
          console.error('Error al eliminar cita:', err);
        }
      });
    }
  }
}
