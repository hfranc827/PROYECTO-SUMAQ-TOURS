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
  forkJoin
} from 'rxjs';

import {
  Paquete
} from '../../../../core/services/paquete';

import {
  Itinerario
} from '../../../../core/services/itinerario';

import {
  PaqueteResponse
} from '../../../../shared/models/paquete.model';

import {
  CreateItinerarioRequest,
  UpdateItinerarioRequest
} from '../../../../shared/models/itinerario.model';


@Component({
  selector: 'app-itinerary-form',

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

  templateUrl: './itinerary-form.html',
  styleUrl: './itinerary-form.scss'
})
export class ItineraryForm
  implements OnInit {

  private readonly fb =
    inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly paqueteService =
    inject(Paquete);

  private readonly itinerarioService =
    inject(Itinerario);


  readonly paquetes =
    signal<PaqueteResponse[]>([]);

  readonly editingId =
    signal<number | null>(null);

  readonly loading =
    signal(true);

  readonly saving =
    signal(false);

  readonly errorMessage =
    signal('');


  readonly form =
    this.fb.nonNullable.group({

      paqueteId: [
        0,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      tourId: [
        0
      ],

      dia: [
        1,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      orden: [
        1,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      titulo: [
        '',
        [
          Validators.required,
          Validators.maxLength(150)
        ]
      ],

      descripcion: [
        ''
      ],

      horaInicio: [
        ''
      ]

    });


  readonly paqueteSeleccionado =
    computed(() => {

      const paqueteId =
        this.form.controls
          .paqueteId.value;

      return this.paquetes()
        .find(
          paquete =>
            paquete.id === paqueteId
        ) ?? null;
    });


  readonly toursDelPaquete =
    computed(() =>
      this.paqueteSeleccionado()
        ?.tours ?? []
    );


  readonly duracionPaquete =
    computed(() =>
      this.paqueteSeleccionado()
        ?.duracionDias ?? null
    );


  ngOnInit(): void {

    const idTexto =
      this.route.snapshot
        .paramMap
        .get('id');


    if (!idTexto) {

      this.cargarCreacion();

      return;
    }


    const id =
      Number(idTexto);


    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {

      this.router.navigate([
        '/admin/itinerarios'
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


  private cargarCreacion(): void {

    this.loading.set(true);

    this.errorMessage.set('');


    this.paqueteService
      .listarTodosAdmin()
      .subscribe({

        next: paquetes => {

          this.paquetes.set(
            paquetes
          );


          const paqueteQuery =
            Number(
              this.route.snapshot
                .queryParamMap
                .get('paqueteId')
            );


          if (
            Number.isInteger(
              paqueteQuery
            ) &&
            paqueteQuery > 0 &&
            paquetes.some(
              paquete =>
                paquete.id ===
                paqueteQuery
            )
          ) {

            this.form.controls
              .paqueteId
              .setValue(
                paqueteQuery
              );
          }


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


    forkJoin({

      paquetes:
        this.paqueteService
          .listarTodosAdmin(),

      itinerario:
        this.itinerarioService
          .obtenerPorId(id)

    })
      .subscribe({

        next: response => {

          this.paquetes.set(
            response.paquetes
          );


          this.form.setValue({

            paqueteId:
              response.itinerario
                .paqueteId,

            tourId:
              response.itinerario
                .tourId ?? 0,

            dia:
              response.itinerario.dia,

            orden:
              response.itinerario.orden,

            titulo:
              response.itinerario.titulo,

            descripcion:
              response.itinerario
                .descripcion ?? '',

            horaInicio:
              this.normalizarHora(
                response.itinerario
                  .horaInicio
              )

          });


          /*
           * UpdateItinerarioRequest
           * no permite cambiar paquete.
           */
          this.form.controls
            .paqueteId
            .disable();


          this.loading.set(false);
        },

        error: error => {

          this.procesarErrorCarga(
            error
          );
        }

      });
  }


  cambiarPaquete(): void {

    /*
     * Al cambiar de paquete debemos
     * eliminar cualquier Tour seleccionado
     * anteriormente.
     */
    this.form.controls
      .tourId
      .setValue(0);

    this.form.controls
      .tourId
      .markAsUntouched();


    const duracion =
      this.duracionPaquete();


    if (
      duracion !== null &&
      this.form.controls
        .dia.value > duracion
    ) {

      this.form.controls
        .dia
        .setValue(1);
    }
  }


  guardar(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }


    const value =
      this.form.getRawValue();


    const paquete =
      this.paquetes()
        .find(
          item =>
            item.id ===
            value.paqueteId
        );


    if (!paquete) {

      this.errorMessage.set(
        'Selecciona un paquete válido.'
      );

      return;
    }


    if (
      value.dia >
      paquete.duracionDias
    ) {

      this.errorMessage.set(
        `El día no puede superar la duración del paquete (${paquete.duracionDias} días).`
      );

      return;
    }


    const descripcion =
      value.descripcion.trim()
        ? value.descripcion.trim()
        : undefined;


    const horaInicio =
      value.horaInicio
        ? value.horaInicio
        : undefined;


    const tourId =
      value.tourId > 0
        ? value.tourId
        : undefined;


    this.saving.set(true);

    this.errorMessage.set('');


    const id =
      this.editingId();


    if (id === null) {

      const request:
        CreateItinerarioRequest = {

        paqueteId:
          value.paqueteId,

        tourId,

        dia:
          value.dia,

        orden:
          value.orden,

        titulo:
          value.titulo.trim(),

        descripcion,

        horaInicio

      };


      this.itinerarioService
        .crear(request)
        .subscribe({

          next: () => {

            this.router.navigate([
              '/admin/itinerarios'
            ]);
          },

          error: error => {

            this.procesarError(
              error
            );
          }

        });

      return;
    }


    const request:
      UpdateItinerarioRequest = {

      tourId,

      dia:
        value.dia,

      orden:
        value.orden,

      titulo:
        value.titulo.trim(),

      descripcion,

      horaInicio

    };


    this.itinerarioService
      .actualizar(
        id,
        request
      )
      .subscribe({

        next: () => {

          this.router.navigate([
            '/admin/itinerarios'
          ]);
        },

        error: error => {

          this.procesarError(
            error
          );
        }

      });
  }


  private normalizarHora(
    hora: string | null
  ): string {

    if (!hora) {
      return '';
    }

    /*
     * Spring puede responder:
     *
     * 13:30
     * 13:30:00
     *
     * Para <input type="time">
     * utilizamos HH:mm.
     */
    return hora.substring(
      0,
      5
    );
  }


  private procesarErrorCarga(
    error: any
  ): void {

    console.error(
      'Error cargando itinerario:',
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
      'Error guardando itinerario:',
      error
    );

    this.saving.set(false);

    this.errorMessage.set(
      error.error?.message ??
      'No fue posible guardar la actividad.'
    );
  }

}