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
  Tour
} from '../../../../core/services/tour';

import {
  Paquete
} from '../../../../core/services/paquete';

import {
  DisponibilidadTour
} from '../../../../core/services/disponibilidad-tour';

import {
  DisponibilidadPaquete
} from '../../../../core/services/disponibilidad-paquete';

import {
  TourResponse
} from '../../../../shared/models/tour.model';

import {
  PaqueteResponse
} from '../../../../shared/models/paquete.model';

import {
  EstadoDisponibilidad
} from '../../../../shared/models/disponibilidad-tour.model';


type TipoDisponibilidad =
  'tour' |
  'paquete';


@Component({
  selector: 'app-availability-form',

  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './availability-form.html',
  styleUrl: './availability-form.scss'
})
export class AvailabilityForm
  implements OnInit {

  private readonly fb =
    inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly tourService =
    inject(Tour);

  private readonly paqueteService =
    inject(Paquete);

  private readonly disponibilidadTourService =
    inject(DisponibilidadTour);

  private readonly disponibilidadPaqueteService =
    inject(DisponibilidadPaquete);


  readonly tipo =
    signal<TipoDisponibilidad | null>(
      null
    );

  readonly editingId =
    signal<number | null>(
      null
    );


  readonly tours =
    signal<TourResponse[]>([]);

  readonly paquetes =
    signal<PaqueteResponse[]>([]);


  readonly toursActivos =
    computed(() =>
      this.tours()
        .filter(
          tour =>
            tour.activo
        )
    );

  readonly paquetesActivos =
    computed(() =>
      this.paquetes()
        .filter(
          paquete =>
            paquete.activo
        )
    );


  readonly estados:
    EstadoDisponibilidad[] = [
      'DISPONIBLE',
      'AGOTADO',
      'BLOQUEADO'
    ];


  readonly loading =
    signal(true);

  readonly saving =
    signal(false);

  readonly errorMessage =
    signal('');


  readonly form =
    this.fb.nonNullable.group({

      recursoId: [
        0,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      fecha: [
        '',
        [
          Validators.required
        ]
      ],

      capacidadTotal: [
        1,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      cuposDisponibles: [
        1,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      estado: [
        'DISPONIBLE' as EstadoDisponibilidad,
        [
          Validators.required
        ]
      ]

    });


  ngOnInit(): void {

    const tipo =
      this.route.snapshot
        .paramMap
        .get('tipo');


    if (
      tipo !== 'tour' &&
      tipo !== 'paquete'
    ) {

      this.router.navigate([
        '/admin/disponibilidades'
      ]);

      return;
    }


    this.tipo.set(
      tipo
    );


    const idTexto =
      this.route.snapshot
        .paramMap
        .get('id');


    if (!idTexto) {

      this.cargarCatalogoCreacion();

      return;
    }


    const id =
      Number(idTexto);


    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {

      this.router.navigate([
        '/admin/disponibilidades'
      ]);

      return;
    }


    this.editingId.set(
      id
    );

    this.cargarEdicion(
      id
    );
  }


  private cargarCatalogoCreacion(): void {

    this.loading.set(true);

    this.errorMessage.set('');


    if (
      this.tipo() === 'tour'
    ) {

      this.tourService
        .listarTodosAdmin()
        .subscribe({

          next: tours => {

            this.tours.set(
              tours
            );

            this.loading.set(false);
          },

          error: error => {

            this.procesarErrorCarga(
              error
            );
          }

        });

      return;
    }


    this.paqueteService
      .listarTodosAdmin()
      .subscribe({

        next: paquetes => {

          this.paquetes.set(
            paquetes
          );

          this.loading.set(false);
        },

        error: error => {

          this.procesarErrorCarga(
            error
          );
        }

      });
  }


  private cargarEdicion(
    id: number
  ): void {

    this.loading.set(true);

    this.errorMessage.set('');


    if (
      this.tipo() === 'tour'
    ) {

      this.disponibilidadTourService
        .obtenerPorId(id)
        .subscribe({

          next: disponibilidad => {

            this.form.setValue({

              recursoId:
                disponibilidad.tourId,

              fecha:
                disponibilidad.fecha,

              capacidadTotal:
                disponibilidad.capacidadTotal,

              cuposDisponibles:
                disponibilidad.cuposDisponibles,

              estado:
                disponibilidad.estado

            });


            this.form.controls
              .recursoId.disable();

            this.form.controls
              .fecha.disable();


            this.loading.set(false);
          },

          error: error => {

            this.procesarErrorCarga(
              error
            );
          }

        });

      return;
    }


    this.disponibilidadPaqueteService
      .obtenerPorId(id)
      .subscribe({

        next: disponibilidad => {

          this.form.setValue({

            recursoId:
              disponibilidad.paqueteId,

            fecha:
              disponibilidad.fecha,

            capacidadTotal:
              disponibilidad.capacidadTotal,

            cuposDisponibles:
              disponibilidad.cuposDisponibles,

            estado:
              disponibilidad.estado

          });


          this.form.controls
            .recursoId.disable();

          this.form.controls
            .fecha.disable();


          this.loading.set(false);
        },

        error: error => {

          this.procesarErrorCarga(
            error
          );
        }

      });
  }


  guardar(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }


    const value =
      this.form.getRawValue();


    if (
      value.cuposDisponibles >
      value.capacidadTotal
    ) {

      this.errorMessage.set(
        'Los cupos disponibles no pueden superar la capacidad total.'
      );

      return;
    }


    this.saving.set(true);

    this.errorMessage.set('');


    const id =
      this.editingId();


    if (id === null) {

      if (
        this.tipo() === 'tour'
      ) {

        this.disponibilidadTourService
          .crear({

            tourId:
              value.recursoId,

            fecha:
              value.fecha,

            capacidadTotal:
              value.capacidadTotal

          })
          .subscribe({

            next: () =>
              this.volver(),

            error: error =>
              this.procesarError(
                error
              )

          });

        return;
      }


      this.disponibilidadPaqueteService
        .crear({

          paqueteId:
            value.recursoId,

          fecha:
            value.fecha,

          capacidadTotal:
            value.capacidadTotal

        })
        .subscribe({

          next: () =>
            this.volver(),

          error: error =>
            this.procesarError(
              error
            )

        });

      return;
    }


    const request = {

      capacidadTotal:
        value.capacidadTotal,

      cuposDisponibles:
        value.cuposDisponibles,

      estado:
        value.estado

    };


    if (
      this.tipo() === 'tour'
    ) {

      this.disponibilidadTourService
        .actualizar(
          id,
          request
        )
        .subscribe({

          next: () =>
            this.volver(),

          error: error =>
            this.procesarError(
              error
            )

        });

      return;
    }


    this.disponibilidadPaqueteService
      .actualizar(
        id,
        request
      )
      .subscribe({

        next: () =>
          this.volver(),

        error: error =>
          this.procesarError(
            error
          )

      });
  }


  private volver(): void {

    this.router.navigate([
      '/admin/disponibilidades'
    ]);
  }


  private procesarErrorCarga(
    error: any
  ): void {

    console.error(
      'Error cargando disponibilidad:',
      error
    );

    this.loading.set(false);

    this.errorMessage.set(
      error.error?.message ??
      'No fue posible cargar la información.'
    );
  }


  private procesarError(
    error: any
  ): void {

    console.error(
      'Error guardando disponibilidad:',
      error
    );

    this.saving.set(false);

    this.errorMessage.set(
      error.error?.message ??
      'No fue posible guardar la disponibilidad.'
    );
  }

}