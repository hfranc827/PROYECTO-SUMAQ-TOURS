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
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  forkJoin
} from 'rxjs';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
  Paquete
} from '../../../core/services/paquete';

import {
  DisponibilidadPaquete
} from '../../../core/services/disponibilidad-paquete';

import {
  Reserva
} from '../../../core/services/reserva';

import {
  Auth
} from '../../../core/services/auth';

import {
  PaqueteResponse
} from '../../../shared/models/paquete.model';

import {
  DisponibilidadPaqueteResponse
} from '../../../shared/models/disponibilidad-paquete.model';


@Component({
  selector: 'app-paquete-detail',

  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './paquete-detail.html',
  styleUrl: './paquete-detail.scss'
})
export class PaqueteDetail
  implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly paqueteService =
    inject(Paquete);

  private readonly disponibilidadService =
    inject(DisponibilidadPaquete);

  private readonly reservaService =
    inject(Reserva);

  private readonly authService =
    inject(Auth);


  readonly paquete =
    signal<PaqueteResponse | null>(
      null
    );


  /*
   * Imagen actualmente mostrada
   * en el visor principal.
   */
  readonly imagenSeleccionada =
    signal<string | null>(
      null
    );


  readonly disponibilidades =
    signal<
      DisponibilidadPaqueteResponse[]
    >([]);


  readonly disponibilidadSeleccionada =
    signal<
      DisponibilidadPaqueteResponse | null
    >(null);


  readonly loading =
    signal(true);


  readonly errorMessage =
    signal('');


  readonly reservando =
    signal(false);


  readonly reservaError =
    signal('');


  readonly cantidadPersonas =
    new FormControl<number>(
      1,
      {
        nonNullable: true,

        validators: [
          Validators.required,
          Validators.min(1)
        ]
      }
    );


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
        '/paquetes'
      ]);

      return;
    }


    this.cargarDetalle(
      id
    );
  }


  private cargarDetalle(
    id: number
  ): void {

    this.loading.set(true);

    this.errorMessage.set('');


    forkJoin({

      paquete:
        this.paqueteService
          .obtenerPorId(id),

      disponibilidades:
        this.disponibilidadService
          .listarPorPaquete(id)

    })
      .subscribe({

        next: response => {

          this.paquete.set(
            response.paquete
          );


          /*
           * La imagen principal tiene prioridad.
           *
           * Si no existe portada, usamos
           * automáticamente la primera imagen
           * adicional disponible.
           */
          this.imagenSeleccionada.set(

            response.paquete
              .imagenPrincipalUrl

            ??
            response.paquete
              .imagenes?.[0]?.url

            ??
            null

          );


          this.disponibilidades.set(
            response.disponibilidades
          );


          this.loading.set(false);
        },


        error: error => {

          console.error(
            'Error cargando paquete:',
            error
          );


          this.loading.set(false);


          if (
            error.status === 404
          ) {

            this.errorMessage.set(
              'El paquete solicitado no existe.'
            );

            return;
          }


          this.errorMessage.set(
            'No fue posible cargar el paquete.'
          );
        }

      });
  }


  /*
   * Cambia la fotografía grande
   * cuando el usuario selecciona
   * una miniatura.
   */
  seleccionarImagen(
    url: string
  ): void {

    if (!url) {
      return;
    }


    this.imagenSeleccionada.set(
      url
    );
  }


  seleccionarDisponibilidad(
    disponibilidad:
      DisponibilidadPaqueteResponse
  ): void {

    if (
      disponibilidad.estado !==
      'DISPONIBLE' ||
      disponibilidad.cuposDisponibles <= 0
    ) {

      return;
    }


    this.disponibilidadSeleccionada
      .set(
        disponibilidad
      );


    this.reservaError.set('');


    this.cantidadPersonas
      .setValue(1);


    this.cantidadPersonas
      .setValidators([

        Validators.required,

        Validators.min(1),

        Validators.max(
          disponibilidad
            .cuposDisponibles
        )

      ]);


    this.cantidadPersonas
      .updateValueAndValidity();
  }


  crearReserva(): void {

    const disponibilidad =
      this.disponibilidadSeleccionada();


    const cantidad =
      this.cantidadPersonas.value;


    this.reservaError.set('');


    if (!disponibilidad) {

      this.reservaError.set(
        'Selecciona una fecha disponible.'
      );

      return;
    }


    if (
      this.cantidadPersonas.invalid
    ) {

      this.cantidadPersonas
        .markAsTouched();

      return;
    }


    if (
      !this.authService
        .isAuthenticated()
    ) {

      this.router.navigate([
        '/login'
      ]);

      return;
    }


    this.reservando.set(true);


    this.reservaService
      .crear({

        disponibilidadPaqueteId:
          disponibilidad.id,

        cantidadPersonas:
          cantidad

      })
      .subscribe({

        next: () => {

          this.reservando.set(false);


          this.router.navigate([
            '/mi-cuenta'
          ]);
        },


        error: error => {

          console.error(
            'Error creando reserva de paquete:',
            error
          );


          this.reservando.set(false);


          if (
            error.status === 401
          ) {

            this.reservaError.set(
              'Debes iniciar sesión para reservar.'
            );

            return;
          }


          if (
            error.status === 403
          ) {

            this.reservaError.set(
              'Tu cuenta no puede realizar esta reserva.'
            );

            return;
          }


          if (
            error.status === 400 ||
            error.status === 409
          ) {

            this.reservaError.set(
              error.error?.message ??
              'No fue posible completar la reserva.'
            );

            return;
          }


          this.reservaError.set(
            'Ocurrió un problema al crear la reserva.'
          );
        }

      });
  }

}