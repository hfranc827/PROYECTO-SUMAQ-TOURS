import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

import { Tour } from '../../../../core/services/tour';
import { TourResponse } from '../../../../shared/models/tour.model';

@Component({
  selector: 'app-tour-list',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './tour-list.html',
  styleUrl: './tour-list.scss'
})
export class TourList implements OnInit {
  private readonly tourService = inject(Tour);

  readonly tours = signal<TourResponse[]>([]);
  readonly loading = signal(true);
  readonly deletingId = signal<number | null>(null);
  readonly errorMessage = signal('');
  readonly actionError = signal('');

  ngOnInit(): void {
    this.cargarTours();
  }

  cargarTours(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.tourService.listarTodosAdmin().subscribe({
      next: tours => {
        this.tours.set(tours);
        this.loading.set(false);
      },
      error: error => {
        console.error('Error cargando tours:', error);
        this.loading.set(false);
        this.errorMessage.set('No fue posible cargar los tours.');
      }
    });
  }

  eliminarTour(tour: TourResponse): void {
    const confirmado = window.confirm(
      `¿Deseas desactivar el tour "${tour.nombre}"?`
    );

    if (!confirmado) {
      return;
    }

    this.deletingId.set(tour.id);
    this.actionError.set('');

    this.tourService.eliminar(tour.id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.cargarTours();
      },
      error: error => {
        console.error('Error desactivando tour:', error);
        this.deletingId.set(null);
        this.actionError.set(
          error.error?.message ?? 'No fue posible desactivar el tour.'
        );
      }
    });
  }
}