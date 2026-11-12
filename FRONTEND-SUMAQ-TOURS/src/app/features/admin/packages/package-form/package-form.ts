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
  Paquete
} from '../../../../core/services/paquete';

import {
  PaqueteImagen
} from '../../../../core/services/paquete-imagen';

import {
  Tour
} from '../../../../core/services/tour';

import {
  TourResponse
} from '../../../../shared/models/tour.model';

import {
  CreatePaqueteRequest,
  PaqueteImagenResponse,
  UpdatePaqueteRequest
} from '../../../../shared/models/paquete.model';

import {
  PaqueteImagenRequest
} from '../../../../shared/models/paquete-imagen.model';


@Component({
  selector: 'app-package-form',

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

  templateUrl: './package-form.html',
  styleUrl: './package-form.scss'
})
export class PackageForm
  implements OnInit {

  private readonly fb =
    inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly paqueteService =
    inject(Paquete);

  private readonly paqueteImagenService =
    inject(PaqueteImagen);

  private readonly tourService =
    inject(Tour);


  readonly editingId =
    signal<number | null>(
      null
    );


  readonly tours =
    signal<TourResponse[]>([]);


  readonly toursActivos =
    computed(() =>
      this.tours()
        .filter(
          tour =>
            tour.activo
        )
    );


  readonly loading =
    signal(true);


  readonly saving =
    signal(false);


  readonly errorMessage =
    signal('');


  readonly successMessage =
    signal('');


  readonly imagenes =
    signal<PaqueteImagenResponse[]>([]);


  readonly guardandoImagen =
    signal<number | null>(
      null
    );


  readonly galeriaError =
    signal('');


  readonly galeriaSuccess =
    signal('');


  readonly form =
    this.fb.nonNullable.group({

      nombre: [
        '',
        [
          Validators.required,
          Validators.maxLength(150)
        ]
      ],

      descripcion: [
        '',
        [
          Validators.required
        ]
      ],

      precio: [
        0,
        [
          Validators.required,
          Validators.min(0.01)
        ]
      ],

      duracionDias: [
        1,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      duracionNoches: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      capacidadMaxima: [
        1,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      imagenPrincipalUrl: [
        '',
        [
          Validators.maxLength(500)
        ]
      ],

      incluye: [
        ''
      ],

      noIncluye: [
        ''
      ],

      tourIds: [
        [] as number[],
        [
          Validators.required
        ]
      ],

      activo: [
        true
      ]

    });


  readonly galeriaForm =
    this.fb.nonNullable.group({

      imagen2: [''],

      imagen3: [''],

      imagen4: ['']

    });


  ngOnInit(): void {

    const idTexto =
      this.route.snapshot
        .paramMap
        .get('id');


    if (!idTexto) {

      this.cargarTours();

      return;
    }


    const id =
      Number(idTexto);


    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {

      this.router.navigate([
        '/admin/paquetes'
      ]);

      return;
    }


    this.editingId.set(
      id
    );


    this.cargarDatosEdicion(
      id
    );
  }


  private cargarTours(): void {

    this.loading.set(true);

    this.errorMessage.set('');


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

          console.error(
            'Error cargando tours:',
            error
          );


          this.loading.set(false);


          this.errorMessage.set(
            'No fue posible cargar los tours.'
          );
        }

      });
  }


  private cargarDatosEdicion(
    id: number
  ): void {

    this.loading.set(true);

    this.errorMessage.set('');

    this.galeriaError.set('');


    forkJoin({

      tours:
        this.tourService
          .listarTodosAdmin(),

      paquete:
        this.paqueteService
          .obtenerPorId(id),

      imagenes:
        this.paqueteImagenService
          .listar(id)

    })
      .subscribe({

        next: response => {

          this.tours.set(
            response.tours
          );


          this.form.setValue({

            nombre:
              response.paquete.nombre,

            descripcion:
              response.paquete.descripcion,

            precio:
              response.paquete.precio,

            duracionDias:
              response.paquete.duracionDias,

            duracionNoches:
              response.paquete.duracionNoches,

            capacidadMaxima:
              response.paquete.capacidadMaxima,

            imagenPrincipalUrl:
              response.paquete
                .imagenPrincipalUrl ?? '',

            incluye:
              response.paquete
                .incluye ?? '',

            noIncluye:
              response.paquete
                .noIncluye ?? '',

            tourIds:
              response.paquete.tours
                .map(
                  tour =>
                    tour.id
                ),

            activo:
              response.paquete.activo

          });


          this.cargarGaleriaEnFormulario(
            response.imagenes
          );


          this.loading.set(false);
        },


        error: error => {

          console.error(
            'Error cargando paquete:',
            error
          );


          this.loading.set(false);


          this.errorMessage.set(
            'No fue posible cargar el paquete.'
          );
        }

      });
  }


  private cargarGaleriaEnFormulario(
    imagenes: PaqueteImagenResponse[]
  ): void {

    const ordenadas =
      [...imagenes]
        .sort(
          (a, b) =>
            a.orden - b.orden
        );


    this.imagenes.set(
      ordenadas
    );


    this.galeriaForm.setValue({

      imagen2:
        ordenadas.find(
          imagen =>
            imagen.orden === 1
        )?.url ?? '',

      imagen3:
        ordenadas.find(
          imagen =>
            imagen.orden === 2
        )?.url ?? '',

      imagen4:
        ordenadas.find(
          imagen =>
            imagen.orden === 3
        )?.url ?? ''

    });
  }


  guardar(): void {

    this.errorMessage.set('');
    this.successMessage.set('');


    if (
      this.form.invalid ||
      this.form.controls
        .tourIds.value.length === 0
    ) {

      this.form.markAllAsTouched();


      const camposInvalidos =
        this.obtenerCamposInvalidos();


      console.warn(
        'Formulario inválido:',
        camposInvalidos
      );


      this.errorMessage.set(
        camposInvalidos.length > 0
          ? `Revisa los siguientes campos: ${camposInvalidos.join(', ')}.`
          : 'Revisa los datos del formulario.'
      );

      return;
    }


    const value =
      this.form.getRawValue();


    const imagenPrincipalUrl =
      value.imagenPrincipalUrl.trim()
        ? value.imagenPrincipalUrl.trim()
        : undefined;


    const incluye =
      value.incluye.trim()
        ? value.incluye.trim()
        : undefined;


    const noIncluye =
      value.noIncluye.trim()
        ? value.noIncluye.trim()
        : undefined;


    const id =
      this.editingId();


    this.saving.set(true);


    if (id === null) {

      const request:
        CreatePaqueteRequest = {

        nombre:
          value.nombre.trim(),

        descripcion:
          value.descripcion.trim(),

        precio:
          value.precio,

        duracionDias:
          value.duracionDias,

        duracionNoches:
          value.duracionNoches,

        capacidadMaxima:
          value.capacidadMaxima,

        imagenPrincipalUrl,

        incluye,

        noIncluye,

        tourIds:
          value.tourIds
      };


      this.paqueteService
        .crear(request)
        .subscribe({

          next: paquete => {

            this.saving.set(false);


            this.router.navigate([
              '/admin/paquetes',
              paquete.id,
              'editar'
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
      UpdatePaqueteRequest = {

      nombre:
        value.nombre.trim(),

      descripcion:
        value.descripcion.trim(),

      precio:
        value.precio,

      duracionDias:
        value.duracionDias,

      duracionNoches:
        value.duracionNoches,

      capacidadMaxima:
        value.capacidadMaxima,

      imagenPrincipalUrl,

      incluye,

      noIncluye,

      tourIds:
        value.tourIds,

      activo:
        value.activo
    };


    this.paqueteService
      .actualizar(
        id,
        request
      )
      .subscribe({

        next: () => {

          this.router.navigate([
            '/admin/paquetes'
          ]);
        },


        error: error => {

          this.procesarError(
            error
          );
        }

      });
  }


  private obtenerCamposInvalidos():
    string[] {

    const nombres:
      Record<string, string> = {

      nombre:
        'Nombre',

      descripcion:
        'Descripción',

      precio:
        'Precio',

      duracionDias:
        'Duración en días',

      duracionNoches:
        'Duración en noches',

      capacidadMaxima:
        'Capacidad máxima',

      imagenPrincipalUrl:
        'URL de imagen principal',

      tourIds:
        'Tours incluidos'

    };


    return Object.keys(
      this.form.controls
    )
      .filter(
        key =>
          this.form.get(key)?.invalid
      )
      .map(
        key =>
          nombres[key] ?? key
      );
  }


  controlGaleria(
    orden: number
  ) {

    switch (orden) {

      case 1:

        return this.galeriaForm
          .controls.imagen2;


      case 2:

        return this.galeriaForm
          .controls.imagen3;


      case 3:

        return this.galeriaForm
          .controls.imagen4;


      default:

        throw new Error(
          'Orden de imagen no válido'
        );
    }
  }


  imagenPorOrden(
    orden: number
  ): PaqueteImagenResponse | undefined {

    return this.imagenes()
      .find(
        imagen =>
          imagen.orden === orden
      );
  }


  guardarImagen(
    orden: number
  ): void {

    const paqueteId =
      this.editingId();


    if (paqueteId === null) {

      this.galeriaError.set(
        'Primero debes guardar el paquete.'
      );

      return;
    }


    const control =
      this.controlGaleria(
        orden
      );


    const url =
      control.value.trim();


    this.galeriaError.set('');

    this.galeriaSuccess.set('');


    if (!url) {

      this.galeriaError.set(
        `Ingresa una URL para la foto ${orden + 1}.`
      );

      return;
    }


    const request:
      PaqueteImagenRequest = {

      url,
      orden
    };


    const existente =
      this.imagenPorOrden(
        orden
      );


    this.guardandoImagen.set(
      orden
    );


    const operacion =
      existente

        ? this.paqueteImagenService
          .actualizar(
            paqueteId,
            existente.id,
            request
          )

        : this.paqueteImagenService
          .crear(
            paqueteId,
            request
          );


    operacion.subscribe({

      next: () => {

        this.guardandoImagen.set(
          null
        );


        this.recargarGaleria(
          paqueteId,
          `Foto ${orden + 1} guardada correctamente.`
        );
      },


      error: error => {

        console.error(
          'Error guardando imagen del paquete:',
          error
        );


        this.guardandoImagen.set(
          null
        );


        this.galeriaError.set(
          error.error?.message ??
          `No fue posible guardar la foto ${orden + 1}.`
        );
      }

    });
  }


  eliminarImagen(
    orden: number
  ): void {

    const paqueteId =
      this.editingId();


    const imagen =
      this.imagenPorOrden(
        orden
      );


    if (
      paqueteId === null ||
      !imagen
    ) {

      return;
    }


    const confirmado =
      window.confirm(
        `¿Seguro que deseas eliminar la foto ${orden + 1}?`
      );


    if (!confirmado) {
      return;
    }


    this.guardandoImagen.set(
      orden
    );

    this.galeriaError.set('');

    this.galeriaSuccess.set('');


    this.paqueteImagenService
      .eliminar(
        paqueteId,
        imagen.id
      )
      .subscribe({

        next: () => {

          this.guardandoImagen.set(
            null
          );


          this.recargarGaleria(
            paqueteId,
            `Foto ${orden + 1} eliminada correctamente.`
          );
        },


        error: error => {

          console.error(
            'Error eliminando imagen del paquete:',
            error
          );


          this.guardandoImagen.set(
            null
          );


          this.galeriaError.set(
            error.error?.message ??
            `No fue posible eliminar la foto ${orden + 1}.`
          );
        }

      });
  }


  private recargarGaleria(
    paqueteId: number,
    mensaje?: string
  ): void {

    this.paqueteImagenService
      .listar(
        paqueteId
      )
      .subscribe({

        next: imagenes => {

          this.cargarGaleriaEnFormulario(
            imagenes
          );


          if (mensaje) {

            this.galeriaSuccess.set(
              mensaje
            );
          }
        },


        error: error => {

          console.error(
            'Error recargando galería:',
            error
          );


          this.galeriaError.set(
            'La operación se realizó, pero no fue posible recargar la galería.'
          );
        }

      });
  }


  private procesarError(
    error: any
  ): void {

    console.error(
      'Error guardando paquete:',
      error
    );


    this.saving.set(false);


    this.errorMessage.set(
      error.error?.message ??
      'No fue posible guardar el paquete.'
    );
  }

}