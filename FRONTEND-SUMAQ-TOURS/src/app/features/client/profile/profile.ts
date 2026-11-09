import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';
import {
  RouterLink
} from '@angular/router';

import { CommonModule } from '@angular/common';

import { finalize } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Reserva } from '../../../core/services/reserva';

import {
  ReservaResponse
} from '../../../shared/models/reserva.model';
type FiltroReserva =
  'TODAS' |
  'PENDIENTE' |
  'CONFIRMADA' |
  'PAGADA' |
  'FINALIZADA' |
  'CANCELADA';

@Component({
  selector: 'app-profile',

  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterLink
  ],

  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {

  private readonly reservaService =
    inject(Reserva);


  readonly reservas =
    signal<ReservaResponse[]>([]);

  readonly cancellingId =
    signal<number | null>(null);

  readonly filtro =
    signal<FiltroReserva>(
      'TODAS'
    );

  readonly actionError =
    signal('');

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');


  ngOnInit(): void {

    this.cargarReservas();
  }


  cargarReservas(): void {

    this.loading.set(true);

    this.errorMessage.set('');


    this.reservaService
      .listarMisReservas()
      .pipe(
        finalize(() => {

          this.loading.set(false);

        })
      )
      .subscribe({

        next: reservas => {

          console.log(
            'Reservas recibidas:',
            reservas
          );

          this.reservas.set(
            reservas
          );
        },

        error: error => {

          console.error(
            'Error cargando reservas:',
            error
          );


          if (error.status === 401) {

            this.errorMessage.set(
              'Tu sesión no es válida o expiró.'
            );

            return;
          }


          if (error.status === 403) {

            this.errorMessage.set(
              'No tienes permiso para ver estas reservas.'
            );

            return;
          }


          this.errorMessage.set(
            'No fue posible cargar tus reservas.'
          );
        }

      });
  }

  cancelarReserva(
    reserva: ReservaResponse
  ): void {

    if (
      reserva.estado !== 'PENDIENTE' &&
      reserva.estado !== 'CONFIRMADA'
    ) {
      return;
    }


    const confirmado =
      window.confirm(
        `¿Seguro que deseas cancelar la reserva #${reserva.id}?`
      );


    if (!confirmado) {
      return;
    }


    this.cancellingId.set(
      reserva.id
    );

    this.actionError.set('');


    this.reservaService
      .cancelarMiReserva(
        reserva.id
      )
      .subscribe({

        next: reservaActualizada => {

          this.reservas.update(
            reservas =>
              reservas.map(
                item =>
                  item.id === reservaActualizada.id
                    ? reservaActualizada
                    : item
              )
          );

          this.cancellingId.set(
            null
          );
        },

        error: error => {

          console.error(
            'Error cancelando reserva:',
            error
          );

          this.cancellingId.set(
            null
          );

          this.actionError.set(
            error.error?.message ??
            'No fue posible cancelar la reserva.'
          );
        }

      });
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

  cambiarFiltro(
    filtro: FiltroReserva
  ): void {

    this.filtro.set(
      filtro
    );
  }

}