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
  RouterLink
} from '@angular/router';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
  Pago
} from '../../../core/services/pago';

import {
  Reserva
} from '../../../core/services/reserva';

import {
  PagoResponse
} from '../../../shared/models/pago.model';

import {
  ReservaResponse
} from '../../../shared/models/reserva.model';


@Component({
  selector: 'app-payment-success',

  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './payment-success.html',
  styleUrl: './payment-success.scss'
})
export class PaymentSuccess
  implements OnInit {

  private readonly pagoService =
    inject(Pago);

  private readonly reservaService =
    inject(Reserva);


  readonly pago =
    signal<PagoResponse | null>(
      null
    );


  readonly reserva =
    signal<ReservaResponse | null>(
      null
    );


  readonly loading =
    signal(true);


  readonly pending =
    signal(false);


  ngOnInit(): void {

    const reservaIdTexto =
      sessionStorage.getItem(
        'sumaq_stripe_reserva_id'
      );


    const reservaId =
      Number(reservaIdTexto);


    if (
      !reservaIdTexto ||
      !Number.isInteger(reservaId) ||
      reservaId <= 0
    ) {

      this.loading.set(false);

      this.pending.set(true);

      return;
    }


    this.consultarPago(
      reservaId
    );
  }


  private consultarPago(
    reservaId: number
  ): void {

    this.pagoService
      .obtenerPagoPorReserva(
        reservaId
      )
      .subscribe({

        next: pago => {

          this.pago.set(
            pago
          );

          this.pending.set(false);


          this.cargarReserva(
            reservaId
          );


          sessionStorage.removeItem(
            'sumaq_stripe_reserva_id'
          );
        },


        error: error => {

          console.error(
            'Pago aún no disponible:',
            error
          );

          this.loading.set(false);

          this.pending.set(true);
        }

      });
  }


  private cargarReserva(
    reservaId: number
  ): void {

    this.reservaService
      .listarMisReservas()
      .subscribe({

        next: reservas => {

          const reservaEncontrada =
            reservas.find(
              reserva =>
                reserva.id === reservaId
            ) ?? null;


          this.reserva.set(
            reservaEncontrada
          );


          this.loading.set(false);
        },


        error: error => {

          console.error(
            'No fue posible cargar el resumen de la reserva:',
            error
          );

          /*
           * El pago sí fue confirmado.
           * Si falla el resumen, seguimos
           * mostrando los datos del pago.
           */

          this.loading.set(false);
        }

      });
  }

}