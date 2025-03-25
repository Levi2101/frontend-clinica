import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  imports: [CommonModule]
})
export class AdminComponent implements OnInit {

  citas: any[] = [];

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    this.obtenerCitas();
  }

  obtenerCitas(): void {
    const token = this.auth.obtenerToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>('http://localhost:5000/api/citas', { headers }).subscribe({
      next: (res) => this.citas = res,
      error: (err) => console.error('Error al obtener citas', err)
    });
  }

  eliminarCita(id: string): void {
    const token = this.auth.obtenerToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    if (confirm('¿Estás seguro de eliminar esta cita?')) {
      this.http.delete(`http://localhost:5000/api/citas/${id}`, { headers }).subscribe({
        next: () => {
          this.citas = this.citas.filter(cita => cita._id !== id);
        },
        error: (err) => console.error('Error al eliminar cita', err)
      });
    }
  }
}
