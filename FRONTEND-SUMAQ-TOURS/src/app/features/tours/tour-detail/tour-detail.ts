import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatFormFieldModule }
  from '@angular/material/form-field';

import { MatSelectModule }
  from '@angular/material/select';

import { MatInputModule }
  from '@angular/material/input';

import { Reserva }
  from '../../../core/services/reserva';

import { Auth }
  from '../../../core/services/auth';

import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Tour }
  from '../../../core/services/tour';

import {
  TourResponse
} from '../../../shared/models/tour.model';
import { DisponibilidadTour } from '../../../core/services/disponibilidad-tour';
import { DisponibilidadTourResponse } from '../../../shared/models/disponibilidad-tour.model';


@Component({
  selector: 'app-tour-detail',

  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,

    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],

  templateUrl: './tour-detail.html',
  styleUrl: './tour-detail.scss'
})
export class TourDetail
  implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly tourService =
    inject(Tour);


  readonly tour =
    signal<TourResponse | null>(
      null
    );

  private readonly disponibilidadTourService =
    inject(DisponibilidadTour);


  readonly disponibilidades =
    signal<DisponibilidadTourResponse[]>([]);

  private readonly reservaService =
    inject(Reserva);

  private readonly authService =
    inject(Auth);

  readonly disponibilidadSeleccionada =
    signal<DisponibilidadTourResponse | null>(
      null
    );

  readonly imagenSeleccionada =
    signal<string | null>(
      null
    );

  readonly reservando =
    signal(false);

  readonly reservaError =
    signal('');

  readonly reservaSuccess =
    signal('');

  readonly loading =
    signal(true);

  readonly errorMessage =
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

  seleccionarDisponibilidad(
    disponibilidad:
      DisponibilidadTourResponse
  ): void {

    if (
      disponibilidad.estado !==
      'DISPONIBLE' ||
      disponibilidad.cuposDisponibles <= 0
    ) {

      return;
    }


    this.disponibilidadSeleccionada.set(
      disponibilidad
    );

    this.reservaError.set('');
    this.reservaSuccess.set('');


    this.cantidadPersonas.setValue(1);


    this.cantidadPersonas.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(
        disponibilidad.cuposDisponibles
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
    this.reservaSuccess.set('');


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

        disponibilidadTourId:
          disponibilidad.id,

        cantidadPersonas:
          cantidad

      })
      .subscribe({

        next: reserva => {

          this.reservando.set(false);

          this.reservaSuccess.set(
            `Reserva #${reserva.id} creada correctamente.`
          );


          this.router.navigate([
            '/mi-cuenta'
          ]);
        },

        error: error => {

          console.error(
            'Error creando reserva:',
            error
          );

          this.reservando.set(false);


          if (error.status === 401) {

            this.reservaError.set(
              'Debes iniciar sesión para reservar.'
            );

            return;
          }


          if (error.status === 403) {

            this.reservaError.set(
              'Tu cuenta no tiene permiso para realizar reservas.'
            );

            return;
          }


          if (error.status === 400) {

            this.reservaError.set(
              error.error?.message ??
              'Los datos de la reserva no son válidos.'
            );

            return;
          }


          if (error.status === 409) {

            this.reservaError.set(
              error.error?.message ??
              'Ya no existen suficientes cupos para esta fecha.'
            );

            return;
          }


          this.reservaError.set(
            'No fue posible crear la reserva.'
          );
        }

      });
  }

  ngOnInit(): void {

    const idTexto =
      this.route.snapshot.paramMap
        .get('id');

    const id =
      Number(idTexto);


    if (
      !idTexto ||
      !Number.isInteger(id) ||
      id <= 0
    ) {

      this.router.navigate([
        '/tours'
      ]);

      return;
    }


    this.cargarDetalle(id);
  }

  private cargarDetalle(
    id: number
  ): void {

    this.loading.set(true);

    this.errorMessage.set('');


    forkJoin({

      tour:
        this.tourService
          .obtenerPorId(id),

      disponibilidades:
        this.disponibilidadTourService
          .listarPorTour(id)

    })
      .subscribe({

        next: response => {

          this.tour.set(
            response.tour
          );


          this.imagenSeleccionada.set(
            response.tour.imagenPrincipalUrl
            ??
            response.tour.imagenes?.[0]?.url
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
            'Error cargando detalle del tour:',
            error
          );

          this.loading.set(false);


          if (error.status === 404) {

            this.errorMessage.set(
              'El tour solicitado no existe.'
            );

            return;
          }


          this.errorMessage.set(
            'No fue posible cargar la información del tour.'
          );
        }

      });
  }

  seleccionarImagen(
    url: string
  ): void {

    this.imagenSeleccionada.set(
      url
    );
  }


}