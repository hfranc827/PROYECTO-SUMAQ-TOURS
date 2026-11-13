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
  MatSlideToggleModule
} from '@angular/material/slide-toggle';

import {
  Destino
} from '../../../../core/services/destino';

import {
  CreateDestinoRequest,
  UpdateDestinoRequest
} from '../../../../shared/models/destino.model';


@Component({
  selector: 'app-destination-form',

  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule
  ],

  templateUrl: './destination-form.html',
  styleUrl: './destination-form.scss'
})
export class DestinationForm
  implements OnInit {

  private readonly fb =
    inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly destinoService =
    inject(Destino);


  readonly editingId =
    signal<number | null>(
      null
    );

  readonly loading =
    signal(false);

  readonly saving =
    signal(false);

  readonly errorMessage =
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

      ubicacion: [
        '',
        [
          Validators.required,
          Validators.maxLength(150)
        ]
      ],

      imagenPrincipalUrl: [
        ''
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
      return;
    }


    const id =
      Number(idTexto);


    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {

      this.router.navigate([
        '/admin/destinos'
      ]);

      return;
    }


    this.editingId.set(
      id
    );

    this.cargarDestino(
      id
    );
  }


  private cargarDestino(
    id: number
  ): void {

    this.loading.set(true);


    this.destinoService
      .obtenerPorId(id)
      .subscribe({

        next: destino => {

          this.form.setValue({

            nombre:
              destino.nombre,

            descripcion:
              destino.descripcion,

            ubicacion:
              destino.ubicacion,

            imagenPrincipalUrl:
              destino.imagenPrincipalUrl ?? '',

            activo:
              destino.activo

          });

          this.loading.set(false);
        },

        error: error => {

          console.error(
            'Error cargando destino:',
            error
          );

          this.loading.set(false);

          this.errorMessage.set(
            'No fue posible cargar el destino.'
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


    const imagenPrincipalUrl =
      value.imagenPrincipalUrl.trim()
        ? value.imagenPrincipalUrl.trim()
        : null;


    const id =
      this.editingId();


    this.saving.set(true);

    this.errorMessage.set('');


    if (id === null) {

      const request:
        CreateDestinoRequest = {

        nombre:
          value.nombre.trim(),

        descripcion:
          value.descripcion.trim(),

        ubicacion:
          value.ubicacion.trim(),

        imagenPrincipalUrl
      };


      this.destinoService
        .crear(request)
        .subscribe({

          next: () => {

            this.router.navigate([
              '/admin/destinos'
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
      UpdateDestinoRequest = {

      nombre:
        value.nombre.trim(),

      descripcion:
        value.descripcion.trim(),

      ubicacion:
        value.ubicacion.trim(),

      imagenPrincipalUrl,

      activo:
        value.activo
    };


    this.destinoService
      .actualizar(
        id,
        request
      )
      .subscribe({

        next: () => {

          this.router.navigate([
            '/admin/destinos'
          ]);
        },

        error: error => {

          this.procesarError(
            error
          );
        }

      });
  }


  private procesarError(
    error: any
  ): void {

    console.error(
      'Error guardando destino:',
      error
    );

    this.saving.set(false);


    this.errorMessage.set(
      error.error?.message ??
      'No fue posible guardar el destino.'
    );
  }

}