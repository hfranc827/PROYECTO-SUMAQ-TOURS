import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatCardModule
} from '@angular/material/card';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
  Reserva
} from '../../../core/services/reserva';

import {
  EstadoReserva,
  ReservaResponse
} from '../../../shared/models/reserva.model';


type FiltroReserva =
  'TODAS' |
  EstadoReserva;


@Component({
  selector: 'app-dashboard',

  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard
  implements OnInit {

  private readonly reservaService =
    inject(Reserva);


  readonly reservas =
    signal<ReservaResponse[]>([]);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');

  readonly filtro =
    signal<FiltroReserva>(
      'TODAS'
    );

  readonly totalReservas =
    computed(() =>
      this.reservas().length
    );


  readonly totalPendientes =
    computed(() =>
      this.reservas()
        .filter(
          reserva =>
            reserva.estado === 'PENDIENTE'
        )
        .length
    );


  readonly totalConfirmadas =
    computed(() =>
      this.reservas()
        .filter(
          reserva =>
            reserva.estado === 'CONFIRMADA'
        )
        .length
    );


  readonly totalPagadas =
    computed(() =>
      this.reservas()
        .filter(
          reserva =>
            reserva.estado === 'PAGADA'
        )
        .length
    );


  readonly totalFinalizadas =
    computed(() =>
      this.reservas()
        .filter(
          reserva =>
            reserva.estado === 'FINALIZADA'
        )
        .length
    );


  readonly totalCanceladas =
    computed(() =>
      this.reservas()
        .filter(
          reserva =>
            reserva.estado === 'CANCELADA'
        )
        .length
    );


  ngOnInit(): void {
    this.cargarReservas();
  }


  cargarReservas(): void {

    this.loading.set(true);

    this.errorMessage.set('');


    this.reservaService
      .listarTodas()
      .subscribe({

        next: reservas => {

          this.reservas.set(
            reservas
          );

          this.loading.set(false);
        },

        error: error => {

          console.error(
            'Error cargando reservas:',
            error
          );

          this.loading.set(false);

          this.errorMessage.set(
            'No fue posible cargar las reservas.'
          );
        }

      });
  }


  cambiarFiltro(
    filtro: FiltroReserva
  ): void {

    this.filtro.set(
      filtro
    );
  }


  reservasFiltradas():
    ReservaResponse[] {

    const filtro =
      this.filtro();

    if (filtro === 'TODAS') {
      return this.reservas();
    }

    return this.reservas()
      .filter(
        reserva =>
          reserva.estado === filtro
      );
  }

}