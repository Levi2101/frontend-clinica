import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private apiUrl = 'http://localhost:5000/api/citas';

  constructor(private http: HttpClient) { }

  // Crear una nueva cita
  agendarCita(cita: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, cita, { headers: headers });
  }

  // Obtener todas las citas
  obtenerCitas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Eliminar una cita por ID
  eliminarCita(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
