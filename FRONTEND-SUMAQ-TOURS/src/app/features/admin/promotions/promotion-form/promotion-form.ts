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
  MatSlideToggleModule
} from '@angular/material/slide-toggle';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
  forkJoin
} from 'rxjs';

import {
  Promocion
} from '../../../../core/services/promocion';

import {
  Tour
} from '../../../../core/services/tour';

import {
  Paquete
} from '../../../../core/services/paquete';

import {
  TourResponse
} from '../../../../shared/models/tour.model';

import {
  PaqueteResponse
} from '../../../../shared/models/paquete.model';

import {
  CreatePromocionRequest,
  TipoProductoPromocion,
  UpdatePromocionRequest
} from '../../../../shared/models/promocion.model';


@Component({
  selector: 'app-promotion-form',

  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './promotion-form.html',
  styleUrl: './promotion-form.scss'
})
export class PromotionForm
  implements OnInit {

  private readonly fb =
    inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly promocionService =
    inject(Promocion);

  private readonly tourService =
    inject(Tour);

  private readonly paqueteService =
    inject(Paquete);


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


  readonly loading =
    signal(true);

  readonly saving =
    signal(false);

  readonly errorMessage =
    signal('');


  readonly form =
    this.fb.nonNullable.group({

      titulo: [
        '',
        [
          Validators.required,
          Validators.maxLength(150)
        ]
      ],

      descripcion: [
        '',
        [
          Validators.maxLength(500)
        ]
      ],

      porcentajeDescuento: [
        1,
        [
          Validators.required,
          Validators.min(0.01),
          Validators.max(100)
        ]
      ],

      fechaInicio: [
        '',
        [
          Validators.required
        ]
      ],

      fechaFin: [
        '',
        [
          Validators.required
        ]
      ],

      tipoProducto: [
        'TOUR' as TipoProductoPromocion,
        [
          Validators.required
        ]
      ],

      productoId: [
        0,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      activo: [
        true
      ]

    });


  ngOnInit(): void {

    const idTexto =
      this.route.snapshot
        .paramMap
        .get('id');


    if (!idTexto) {

      this.cargarProductos();

      return;
    }


    const id =
      Number(idTexto);


    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {

      this.router.navigate([
        '/admin/promociones'
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


  private cargarProductos(): void {

    this.loading.set(true);

    this.errorMessage.set('');


    forkJoin({

      tours:
        this.tourService
          .listarTodosAdmin(),

      paquetes:
        this.paqueteService
          .listarTodosAdmin()

    })
      .subscribe({

        next: response => {

          this.tours.set(
            response.tours
          );

          this.paquetes.set(
            response.paquetes
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


    forkJoin({

      tours:
        this.tourService
          .listarTodosAdmin(),

      paquetes:
        this.paqueteService
          .listarTodosAdmin(),

      promocion:
        this.promocionService
          .obtenerPorId(id)

    })
      .subscribe({

        next: response => {

          this.tours.set(
            response.tours
          );

          this.paquetes.set(
            response.paquetes
          );


          this.form.setValue({

            titulo:
              response.promocion.titulo,

            descripcion:
              response.promocion
                .descripcion ?? '',

            porcentajeDescuento:
              response.promocion
                .porcentajeDescuento,

            fechaInicio:
              response.promocion
                .fechaInicio,

            fechaFin:
              response.promocion
                .fechaFin,

            tipoProducto:
              response.promocion
                .tipoProducto,

            productoId:
              response.promocion
                .productoId,

            activo:
              response.promocion.activo

          });


          this.loading.set(false);
        },

        error: error => {

          this.procesarErrorCarga(
            error
          );
        }

      });
  }


  cambiarTipoProducto(): void {

    this.form.controls
      .productoId
      .setValue(0);

    this.form.controls
      .productoId
      .markAsUntouched();
  }


  guardar(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }


    const value =
      this.form.getRawValue();


    if (
      value.fechaFin <
      value.fechaInicio
    ) {

      this.errorMessage.set(
        'La fecha de fin no puede ser anterior a la fecha de inicio.'
      );

      return;
    }


    const descripcion =
      value.descripcion.trim()
        ? value.descripcion.trim()
        : undefined;


    this.saving.set(true);

    this.errorMessage.set('');


    const producto = {

      tourId:
        value.tipoProducto === 'TOUR'
          ? value.productoId
          : undefined,

      paqueteId:
        value.tipoProducto === 'PAQUETE'
          ? value.productoId
          : undefined

    };


    const id =
      this.editingId();


    if (id === null) {

      const request:
        CreatePromocionRequest = {

        titulo:
          value.titulo.trim(),

        descripcion,

        porcentajeDescuento:
          value.porcentajeDescuento,

        fechaInicio:
          value.fechaInicio,

        fechaFin:
          value.fechaFin,

        ...producto
      };


      this.promocionService
        .crear(request)
        .subscribe({

          next: () => {

            this.router.navigate([
              '/admin/promociones'
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
      UpdatePromocionRequest = {

      titulo:
        value.titulo.trim(),

      descripcion,

      porcentajeDescuento:
        value.porcentajeDescuento,

      fechaInicio:
        value.fechaInicio,

      fechaFin:
        value.fechaFin,

      activo:
        value.activo,

      ...producto
    };


    this.promocionService
      .actualizar(
        id,
        request
      )
      .subscribe({

        next: () => {

          this.router.navigate([
            '/admin/promociones'
          ]);
        },

        error: error => {

          this.procesarError(
            error
          );
        }

      });
  }


  private procesarErrorCarga(
    error: any
  ): void {

    console.error(
      'Error cargando promoción:',
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
      'Error guardando promoción:',
      error
    );

    this.saving.set(false);

    this.errorMessage.set(
      error.error?.message ??
      'No fue posible guardar la promoción.'
    );
  }

}