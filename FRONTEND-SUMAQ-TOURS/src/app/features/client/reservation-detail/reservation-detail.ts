import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';
import {
  PagoResponse
} from '../../../shared/models/pago.model';
import {
  Pago
} from '../../../core/services/pago';

import {
  CommonModule
} from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

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
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatSelectModule
} from '@angular/material/select';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
  Reserva
} from '../../../core/services/reserva';

import {
  Pasajero
} from '../../../core/services/pasajero';

import {
  ReservaResponse
} from '../../../shared/models/reserva.model';

import {
  CreatePasajeroRequest,
  PasajeroResponse
} from '../../../shared/models/pasajero.model';

import {
  DisponibilidadPaquete
} from '../../../core/services/disponibilidad-paquete';

import {
  Paquete
} from '../../../core/services/paquete';

import {
  PaqueteResponse
} from '../../../shared/models/paquete.model';

@Component({
  selector: 'app-reservation-detail',

  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,

    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './reservation-detail.html',
  styleUrl: './reservation-detail.scss'
})
export class ReservationDetail
  implements OnInit {

  private readonly disponibilidadPaqueteService =
    inject(DisponibilidadPaquete);

  private readonly paqueteService =
    inject(Paquete);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly fb =
    inject(FormBuilder);

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
  readonly cancelling =
    signal(false);

  readonly loading =
    signal(true);

  readonly saving =
    signal(false);

  readonly paying =
    signal(false);

  readonly paymentError =
    signal('');

  readonly errorMessage =
    signal('');

  readonly formError =
    signal('');

  readonly editingId =
    signal<number | null>(null);

  readonly paqueteResumen =
    signal<PaqueteResponse | null>(
      null
    );


  readonly pasajeroForm =
    this.fb.nonNullable.group({

      nombres: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      apellidos: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      tipoDocumento: [
        '',
        [
          Validators.required,
          Validators.maxLength(30)
        ]
      ],

      numeroDocumento: [
        '',
        [
          Validators.required,
          Validators.maxLength(30)
        ]
      ],

      fechaNacimiento: [
        ''
      ],

      nacionalidad: [
        '',
        [
          Validators.maxLength(60)
        ]
      ]

    });


  ngOnInit(): void {

    const idTexto =
      this.route.snapshot.paramMap
        .get('id');

    const reservaId =
      Number(idTexto);


    if (
      !idTexto ||
      !Number.isInteger(reservaId) ||
      reservaId <= 0
    ) {

      this.router.navigate([
        '/mi-cuenta'
      ]);

      return;
    }


    this.cargarDetalle(
      reservaId
    );
  }


  private cargarDetalle(
    reservaId: number
  ): void {

    this.loading.set(true);

    this.errorMessage.set('');


    this.reservaService
      .listarMisReservas()
      .subscribe({

        next: reservas => {

          const reservaEncontrada =
            reservas.find(
              item =>
                item.id === reservaId
            );


          if (!reservaEncontrada) {

            this.loading.set(false);

            this.errorMessage.set(
              'La reserva solicitada no existe.'
            );

            return;
          }


          this.reserva.set(
            reservaEncontrada
          );

          if (
            reservaEncontrada.tipoReserva ===
            'PAQUETE'
          ) {

            this.cargarResumenPaquete(
              reservaEncontrada
                .disponibilidadId
            );

          } else {

            this.paqueteResumen.set(null);
          }



          if (
            reservaEncontrada.estado === 'PAGADA'
          ) {

            this.cargarPago(
              reservaId
            );
          }


          this.cargarPasajeros(
            reservaId
          );
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
    reservaId: number
  ): void {

    this.pasajeroService
      .listar(reservaId)
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

          this.errorMessage.set(
            'No fue posible cargar los pasajeros.'
          );
        }

      });
  }


  puedeModificarPasajeros(): boolean {

    const reserva =
      this.reserva();

    if (!reserva) {
      return false;
    }


    return (
      reserva.estado === 'PENDIENTE' ||
      reserva.estado === 'CONFIRMADA'
    );
  }


  puedeAgregarPasajero(): boolean {

    const reserva =
      this.reserva();

    if (!reserva) {
      return false;
    }


    return (
      this.puedeModificarPasajeros() &&
      this.pasajeros().length <
      reserva.cantidadPersonas
    );
  }


  guardarPasajero(): void {

    const reserva =
      this.reserva();


    if (
      !reserva ||
      this.pasajeroForm.invalid
    ) {

      this.pasajeroForm
        .markAllAsTouched();

      return;
    }


    const formValue =
      this.pasajeroForm
        .getRawValue();


    const request:
      CreatePasajeroRequest = {

      nombres:
        formValue.nombres.trim(),

      apellidos:
        formValue.apellidos.trim(),

      tipoDocumento:
        formValue.tipoDocumento,

      numeroDocumento:
        formValue.numeroDocumento.trim(),

      fechaNacimiento:
        formValue.fechaNacimiento
          ? formValue.fechaNacimiento
          : null,

      nacionalidad:
        formValue.nacionalidad.trim()
          ? formValue.nacionalidad.trim()
          : null
    };


    const editingId =
      this.editingId();


    this.saving.set(true);

    this.formError.set('');


    const request$ =
      editingId === null

        ? this.pasajeroService.crear(
          reserva.id,
          request
        )

        : this.pasajeroService.actualizar(
          reserva.id,
          editingId,
          request
        );


    request$
      .subscribe({

        next: () => {

          this.saving.set(false);

          this.cancelarEdicion();

          this.cargarPasajeros(
            reserva.id
          );
        },

        error: error => {

          console.error(
            'Error guardando pasajero:',
            error
          );

          this.saving.set(false);


          if (error.status === 400) {

            this.formError.set(
              error.error?.message ??
              'Revisa los datos ingresados.'
            );

            return;
          }


          if (error.status === 409) {

            this.formError.set(
              error.error?.message ??
              'No fue posible registrar el pasajero.'
            );

            return;
          }


          if (error.status === 404) {

            this.formError.set(
              'No se encontró la reserva.'
            );

            return;
          }


          this.formError.set(
            'Ocurrió un problema al guardar el pasajero.'
          );
        }

      });
  }


  editarPasajero(
    pasajero: PasajeroResponse
  ): void {

    this.editingId.set(
      pasajero.id
    );

    this.formError.set('');


    this.pasajeroForm.setValue({

      nombres:
        pasajero.nombres,

      apellidos:
        pasajero.apellidos,

      tipoDocumento:
        pasajero.tipoDocumento,

      numeroDocumento:
        pasajero.numeroDocumento,

      fechaNacimiento:
        pasajero.fechaNacimiento ?? '',

      nacionalidad:
        pasajero.nacionalidad ?? ''

    });
  }


  cancelarEdicion(): void {

    this.editingId.set(null);

    this.formError.set('');

    this.pasajeroForm.reset({

      nombres: '',
      apellidos: '',
      tipoDocumento: '',
      numeroDocumento: '',
      fechaNacimiento: '',
      nacionalidad: ''

    });
  }


  eliminarPasajero(
    pasajeroId: number
  ): void {

    const reserva =
      this.reserva();

    if (
      !reserva ||
      !this.puedeModificarPasajeros()
    ) {

      return;
    }


    this.pasajeroService
      .eliminar(
        reserva.id,
        pasajeroId
      )
      .subscribe({

        next: () => {

          this.cargarPasajeros(
            reserva.id
          );
        },

        error: error => {

          console.error(
            'Error eliminando pasajero:',
            error
          );

          this.formError.set(
            error.error?.message ??
            'No fue posible eliminar el pasajero.'
          );
        }

      });
  }

  puedeCancelarReserva(): boolean {

    const reserva =
      this.reserva();

    if (!reserva) {
      return false;
    }

    return (
      reserva.estado === 'PENDIENTE' ||
      reserva.estado === 'CONFIRMADA'
    );
  }

  cancelarReserva(): void {

    const reserva =
      this.reserva();

    if (
      !reserva ||
      !this.puedeCancelarReserva()
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


    this.cancelling.set(true);

    this.formError.set('');


    this.reservaService
      .cancelarMiReserva(
        reserva.id
      )
      .subscribe({

        next: reservaCancelada => {

          this.reserva.set(
            reservaCancelada
          );

          this.cancelling.set(false);

          this.cancelarEdicion();
        },

        error: error => {

          console.error(
            'Error cancelando reserva:',
            error
          );

          this.cancelling.set(false);


          if (error.status === 409) {

            this.formError.set(
              error.error?.message ??
              'La reserva ya no puede cancelarse.'
            );

            return;
          }


          if (error.status === 404) {

            this.formError.set(
              'No se encontró la reserva.'
            );

            return;
          }


          this.formError.set(
            'No fue posible cancelar la reserva.'
          );
        }

      });
  }

  puedePagar(): boolean {

    const reserva =
      this.reserva();

    if (!reserva) {
      return false;
    }


    return (
      reserva.estado === 'PENDIENTE' &&
      this.pasajeros().length ===
      reserva.cantidadPersonas
    );
  }

  pagarConStripe(): void {

    const reserva =
      this.reserva();


    if (
      !reserva ||
      !this.puedePagar()
    ) {
      return;
    }


    this.paying.set(true);

    this.paymentError.set('');


    this.pagoService
      .crearCheckoutStripe(
        reserva.id
      )
      .subscribe({

        next: response => {

          if (!response.url) {

            this.paying.set(false);

            this.paymentError.set(
              'Stripe no devolvió una URL de pago.'
            );

            return;
          }


          sessionStorage.setItem(
            'sumaq_stripe_reserva_id',
            reserva.id.toString()
          );


          window.location.href =
            response.url;
        },

        error: error => {

          console.error(
            'Error iniciando Stripe:',
            error
          );

          this.paying.set(false);


          if (error.status === 409) {

            this.paymentError.set(
              error.error?.message ??
              'Esta reserva no puede pagarse.'
            );

            return;
          }


          if (error.status === 404) {

            this.paymentError.set(
              'No se encontró la reserva.'
            );

            return;
          }


          this.paymentError.set(
            'No fue posible iniciar el pago con Stripe.'
          );
        }

      });
  }

  private cargarPago(
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
        },

        error: error => {

          console.error(
            'No fue posible cargar el pago:',
            error
          );
        }

      });
  }

  private cargarResumenPaquete(
    disponibilidadId: number
  ): void {

    this.disponibilidadPaqueteService
      .obtenerPorId(
        disponibilidadId
      )
      .subscribe({

        next: disponibilidad => {

          this.paqueteService
            .obtenerPorId(
              disponibilidad.paqueteId
            )
            .subscribe({

              next: paquete => {

                this.paqueteResumen.set(
                  paquete
                );
              },

              error: error => {

                console.error(
                  'No fue posible cargar el resumen del paquete:',
                  error
                );

                this.paqueteResumen.set(
                  null
                );
              }

            });
        },

        error: error => {

          console.error(
            'No fue posible cargar la disponibilidad del paquete:',
            error
          );

          this.paqueteResumen.set(
            null
          );
        }

      });
  }


}