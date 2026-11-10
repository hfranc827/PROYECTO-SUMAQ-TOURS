import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { Tour } from '../../../../core/services/tour';
import { Destino } from '../../../../core/services/destino';
import { DestinoResponse } from '../../../../shared/models/destino.model';
import { CreateTourRequest, NivelDificultad, TourImagenResponse, UpdateTourRequest } from '../../../../shared/models/tour.model';
import { TourImagen } from '../../../../core/services/tour-imagen';
import { TourImagenRequest } from '../../../../shared/models/tour-imagen.model';

@Component({
  selector: 'app-tour-form',
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatSlideToggleModule, MatProgressSpinnerModule
  ],
  templateUrl: './tour-form.html',
  styleUrl: './tour-form.scss'
})
export class TourForm implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tourService = inject(Tour);
  private readonly tourImagenService = inject(TourImagen);
  private readonly destinoService = inject(Destino);

  readonly editingId = signal<number | null>(null);
  readonly destinos = signal<DestinoResponse[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly imagenes = signal<TourImagenResponse[]>([]);
  readonly guardandoImagen = signal<number | null>(null);
  readonly galeriaError = signal('');
  readonly galeriaSuccess = signal('');
  readonly destinosActivos = computed(() => this.destinos().filter(destino => destino.activo));
  readonly niveles: NivelDificultad[] = ['FACIL', 'MODERADO', 'DIFICIL'];
  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(150)]],
    destinoId: [0, [Validators.required, Validators.min(1)]],
    descripcion: ['', [Validators.required]],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    duracionHoras: [1, [Validators.required, Validators.min(1)]],
    capacidadMaxima: [1, [Validators.required, Validators.min(1)]],
    nivelDificultad: ['FACIL' as NivelDificultad, [Validators.required]],
    tipoActividad: ['', [Validators.required]],
    imagenPrincipalUrl: [''],
    incluye: [''],
    noIncluye: [''],
    activo: [true]
  });

  readonly galeriaForm = this.fb.nonNullable.group({
    imagen2: [''],
    imagen3: [''],
    imagen4: ['']
  });

  ngOnInit(): void {
    const idTexto = this.route.snapshot.paramMap.get('id');
    if (!idTexto) {
      this.cargarDestinos();
      return;
    }
    const id = Number(idTexto);
    if (!Number.isInteger(id) || id <= 0) {
      this.router.navigate([
        '/admin/tours'
      ]);
      return;
    }
    this.editingId.set(id);
    this.cargarDatosEdicion(id);
  }

  private cargarDestinos(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.destinoService
      .listarTodosAdmin()
      .subscribe({
        next: destinos => {
          this.destinos.set(destinos);
          this.loading.set(false);
        },
        error: error => {
          console.error('Error cargando destinos:', error);
          this.loading.set(false);
          this.errorMessage.set('No fue posible cargar los destinos.');
        }
      });
  }

  private cargarDatosEdicion(
    id: number
  ): void {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      destinos: this.destinoService.listarTodosAdmin(),
      tour: this.tourService.obtenerPorId(id)
    }).subscribe({
      next: response => {
        this.destinos.set(response.destinos);
        this.form.setValue({
          nombre: response.tour.nombre,
          destinoId: response.tour.destinoId,
          descripcion: response.tour.descripcion,
          precio: response.tour.precio,
          duracionHoras: response.tour.duracionHoras,
          capacidadMaxima: response.tour.capacidadMaxima,
          nivelDificultad: response.tour.nivelDificultad,
          tipoActividad: response.tour.tipoActividad,
          imagenPrincipalUrl: response.tour.imagenPrincipalUrl ?? '',
          incluye: response.tour.incluye ?? '',
          noIncluye: response.tour.noIncluye ?? '',
          activo: response.tour.activo
        });

        const imagenes =
          response.tour.imagenes ?? [];


        this.imagenes.set(
          imagenes
        );


        this.galeriaForm.setValue({

          imagen2:
            imagenes.find(
              imagen =>
                imagen.orden === 1
            )?.url ?? '',

          imagen3:
            imagenes.find(
              imagen =>
                imagen.orden === 2
            )?.url ?? '',

          imagen4:
            imagenes.find(
              imagen =>
                imagen.orden === 3
            )?.url ?? ''

        });

        this.loading.set(false);
      },

      error: error => {

        console.error(
          'Error cargando datos del tour:',
          error
        );

        this.loading.set(false);

        this.errorMessage.set(
          'No fue posible cargar el tour.'
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

    const incluye =
      value.incluye.trim()
        ? value.incluye.trim()
        : null;

    const noIncluye =
      value.noIncluye.trim()
        ? value.noIncluye.trim()
        : null;

    const id =
      this.editingId();

    this.saving.set(true);
    this.errorMessage.set('');

    if (id === null) {

      const request:
        CreateTourRequest = {
        nombre: value.nombre.trim(),
        destinoId: value.destinoId,
        descripcion: value.descripcion.trim(),
        precio: value.precio,
        duracionHoras: value.duracionHoras,
        capacidadMaxima: value.capacidadMaxima,
        nivelDificultad: value.nivelDificultad,
        tipoActividad: value.tipoActividad.trim(),
        imagenPrincipalUrl: imagenPrincipalUrl ?? undefined,
        incluye: incluye ?? undefined,
        noIncluye: noIncluye ?? undefined
      };


      this.tourService
        .crear(request)
        .subscribe({
          next: () => {
            this.router.navigate([
              '/admin/tours'
            ]);
          },
          error: error => {
            this.procesarError(error);
          }
        });
      return;
    }

    const request:
      UpdateTourRequest = {

      nombre:
        value.nombre.trim(),

      destinoId:
        value.destinoId,

      descripcion:
        value.descripcion.trim(),

      precio:
        value.precio,

      duracionHoras:
        value.duracionHoras,

      capacidadMaxima:
        value.capacidadMaxima,

      nivelDificultad:
        value.nivelDificultad,

      tipoActividad:
        value.tipoActividad.trim(),

      imagenPrincipalUrl:
        imagenPrincipalUrl ?? undefined,

      incluye:
        incluye ?? undefined,

      noIncluye:
        noIncluye ?? undefined,

      activo:
        value.activo
    };


    this.tourService
      .actualizar(
        id,
        request
      )
      .subscribe({

        next: () => {

          this.router.navigate([
            '/admin/tours'
          ]);
        },

        error: error => {

          this.procesarError(
            error
          );
        }

      });
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
  ): TourImagenResponse | undefined {

    return this.imagenes()
      .find(
        imagen =>
          imagen.orden === orden
      );
  }


  guardarImagen(
    orden: number
  ): void {

    const tourId =
      this.editingId();

    if (tourId === null) {
      return;
    }

    const control =
      this.controlGaleria(orden);

    const url = control.value.trim();
    this.galeriaError.set('');
    this.galeriaSuccess.set('');


    if (!url) { this.galeriaError.set(`Ingresa una URL para la foto ${orden + 1}.`);
      return;
    }

    const request:
      TourImagenRequest = { url, orden };
    const existente = this.imagenPorOrden(orden);
    this.guardandoImagen.set(orden);
    const operacion = existente ? this.tourImagenService.actualizar(tourId, existente.id, request): this.tourImagenService
          .crear(
            tourId,
            request
          );

    operacion.subscribe({
      next: (imagenGuardada: { id: number; orden: number; url: string; }) => {
        this.imagenes.update(
          actuales => {
            const restantes = actuales.filter(
                imagen =>
                  imagen.id !==
                  imagenGuardada.id
                  &&
                  imagen.orden !==
                  imagenGuardada.orden
              );
            return [
              ...restantes,
              imagenGuardada
            ]
              .sort(
                (a, b) =>
                  a.orden - b.orden
              );
          }
        );

        control.setValue(
          imagenGuardada.url
        );

        this.guardandoImagen.set(
          null
        );

        this.galeriaSuccess.set(
          `Foto ${orden + 1} guardada correctamente.`
        );
      },
      error: (error: { error: { message: any; }; }) => {

        console.error('Error guardando imagen del tour:', error);
        this.guardandoImagen.set(null);
        this.galeriaError.set(error.error?.message ?? `No fue posible guardar la foto ${orden + 1}.`);
      }

    });
  }

  eliminarImagen(
    orden: number
  ): void {
    const tourId = this.editingId();
    const imagen = this.imagenPorOrden(orden);

    if (tourId === null || !imagen) {
      return;
    }
    const confirmado =
      window.confirm(`¿Seguro que deseas eliminar la foto ${orden + 1}?`);

    if (!confirmado) {
      return;
    }
    this.guardandoImagen.set(orden);
    this.galeriaError.set('');
    this.galeriaSuccess.set('');
    this.tourImagenService.eliminar(tourId, imagen.id)
      .subscribe({
        next: () => {
          this.imagenes.update(
            actuales =>
              actuales.filter(
                item =>
                  item.id !== imagen.id
              )
          );
          this.controlGaleria(orden).setValue('');
          this.guardandoImagen.set(null);
          this.galeriaSuccess.set(`Foto ${orden + 1} eliminada correctamente.`);
        },
        error: (error: { error: { message: any; }; }) => {
          console.error('Error eliminando imagen del tour:', error);
          this.guardandoImagen.set(null);
          this.galeriaError.set(error.error?.message ?? `No fue posible eliminar la foto ${orden + 1}.`);
        }

      });
  }

  private procesarError(
    error: any
  ): void {
    console.error(
      'Error guardando tour:',
      error
    );
    this.saving.set(false);
    this.errorMessage.set(
      error.error?.message ??
      'No fue posible guardar el tour.'
    );
  }
}