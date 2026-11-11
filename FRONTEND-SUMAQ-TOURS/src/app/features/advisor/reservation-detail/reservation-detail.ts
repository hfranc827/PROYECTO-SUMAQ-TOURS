import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
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
  MatSelectModule
} from '@angular/material/select';

import {
  Reserva
} from '../../../core/services/reserva';

import {
  Pasajero
} from '../../../core/services/pasajero';

import {
  Pago
} from '../../../core/services/pago';

import {
  EstadoReserva,
  ReservaResponse
} from '../../../shared/models/reserva.model';

import {
  PasajeroResponse
} from '../../../shared/models/pasajero.model';

import {
  PagoResponse
} from '../../../shared/models/pago.model';


@Component({
  selector: 'app-advisor-reservation-detail',

  imports: [
    CommonModule,
    RouterLink,

    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],

  templateUrl: './reservation-detail.html',
  styleUrl: './reservation-detail.scss'
})
export class ReservationDetail
  implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly reservaService =
    inject(Reserva);

  private readonly pasajeroService =
    inject(Pasajero);

  private readonly pagoService =
    inject(Pago);


  readonly reserva =
    signal<ReservaResponse | null>(
      null
    );

  readonly pasajeros =
    signal<PasajeroResponse[]>([]);

  readonly pago =
    signal<PagoResponse | null>(
      null
    );

  readonly loading =
    signal(true);

  readonly updating =
    signal(false);

  readonly errorMessage =
    signal('');

  readonly actionError =
    signal('');


  ngOnInit(): void {

    const idTexto =
      this.route.snapshot
        .paramMap
        .get('id');

    const id =
      Number(idTexto);


    if (
      !idTexto ||
      !Number.isInteger(id) ||
      id <= 0
    ) {

      this.router.navigate([
        '/asesor'
      ]);

      return;
    }


    this.cargarReserva(id);
  }


  private cargarReserva(
    id: number
  ): void {

    this.loading.set(true);


    this.reservaService
      .obtenerPorId(id)
      .subscribe({

        next: reserva => {

          this.reserva.set(
            reserva
          );

          this.cargarPasajeros(
            id
          );


          if (
            reserva.estado === 'PAGADA' ||
            reserva.estado === 'FINALIZADA'
          ) {

            this.cargarPago(
              id
            );
          }
        },

        error: error => {

          console.error(
            'Error cargando reserva:',
            error
          );

          this.loading.set(false);

          this.errorMessage.set(
            'No fue posible cargar la reserva.'
          );
        }

      });
  }


  private cargarPasajeros(
    id: number
  ): void {

    this.pasajeroService
      .listar(id)
      .subscribe({

        next: pasajeros => {

          this.pasajeros.set(
            pasajeros
          );

          this.loading.set(false);
        },

        error: error => {

          console.error(
            'Error cargando pasajeros:',
            error
          );

          this.loading.set(false);
        }

      });
  }


  private cargarPago(
    id: number
  ): void {

    this.pagoService
      .obtenerPagoPorReserva(id)
      .subscribe({

        next: pago => {

          this.pago.set(
            pago
          );
        },

        error: error => {

          console.error(
            'No se pudo cargar el pago:',
            error
          );
        }

      });
  }


  estadosPermitidos():
    EstadoReserva[] {

    const reserva =
      this.reserva();

    if (!reserva) {
      return [];
    }


    switch (reserva.estado) {

      case 'PENDIENTE':
        return [
          'CONFIRMADA',
          'CANCELADA'
        ];

      case 'CONFIRMADA':
        return [
          'CANCELADA'
        ];

      case 'PAGADA':
        return [
          'FINALIZADA'
        ];

      case 'FINALIZADA':
      case 'CANCELADA':
        return [];
    }
  }


  cambiarEstado(
    nuevoEstado: EstadoReserva
  ): void {

    const reserva =
      this.reserva();

    if (!reserva) {
      return;
    }


    this.updating.set(true);

    this.actionError.set('');


    this.reservaService
      .actualizarEstado(
        reserva.id,
        {
          estado: nuevoEstado
        }
      )
      .subscribe({

        next: actualizada => {

          this.reserva.set(
            actualizada
          );

          this.updating.set(false);
        },

        error: error => {

          console.error(
            'Error actualizando estado:',
            error
          );

          this.updating.set(false);

          this.actionError.set(
            error.error?.message ??
            'No fue posible actualizar el estado.'
          );
        }

      });
  }

}