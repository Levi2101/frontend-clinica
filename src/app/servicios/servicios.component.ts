import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

// Definimos los tipos válidos para servicioSeleccionado
type TipoServicio = 
  | 'urgencias'
  | 'quirurgica'
  | 'terapia-intensiva'
  | 'neonatologia'
  | 'hospitalizacion'
  | 'hemodinamia'
  | 'endoscopia';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss'],
})
export class ServiciosComponent {
  // Definimos servicioSeleccionado con el tipo específico
  servicioSeleccionado: TipoServicio | null = null;

  // Definimos servicios como constante y lo tipamos correctamente
  servicios = {
    'urgencias': {
      titulo: 'Urgencias',
      descripcion: 'Atención médica inmediata y cuidados críticos en situaciones de emergencia.',
    },
    'quirurgica': {
      titulo: 'Unidad Quirúrgica',
      descripcion: 'Intervenciones quirúrgicas con tecnología avanzada y especialistas altamente capacitados.',
    },
    'terapia-intensiva': {
      titulo: 'Unidad de Terapia Intensiva',
      descripcion: 'Cuidados intensivos para pacientes en estado crítico, con monitoreo constante.',
    },
    'neonatologia': {
      titulo: 'Neonatología',
      descripcion: 'Cuidado especializado para recién nacidos, incluyendo prematuros y con condiciones especiales.',
    },
    'hospitalizacion': {
      titulo: 'Hospitalización',
      descripcion: 'Estancias cómodas y seguras para recuperación y tratamiento médico.',
    },
    'hemodinamia': {
      titulo: 'Hemodinamia',
      descripcion: 'Estudios y procedimientos cardiovasculares mínimamente invasivos.',
    },
    'endoscopia': {
      titulo: 'Endoscopia',
      descripcion: 'Diagnóstico y tratamiento con tecnología endoscópica avanzada.',
    }
  } as const;

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      const tipo = params.get('tipo') as TipoServicio;
      this.servicioSeleccionado = tipo;
    });
  }
}
