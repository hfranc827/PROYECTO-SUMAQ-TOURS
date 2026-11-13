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
  MatCardModule
} from '@angular/material/card';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

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
  DisponibilidadTourResponse
} from '../../../../shared/models/disponibilidad-tour.model';

import {
  DisponibilidadPaqueteResponse
} from '../../../../shared/models/disponibilidad-paquete.model';


type TipoDisponibilidad =
  'TOUR' |
  'PAQUETE';


@Component({
  selector: 'app-availability-list',

  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './availability-list.html',
  styleUrl: './availability-list.scss'
})
export class AvailabilityList
  implements OnInit {

  private readonly tourService =
    inject(Tour);

  private readonly paqueteService =
    inject(Paquete);

  private readonly disponibilidadTourService =
    inject(DisponibilidadTour);

  private readonly disponibilidadPaqueteService =
    inject(DisponibilidadPaquete);


  readonly tipo =
    signal<TipoDisponibilidad>(
      'TOUR'
    );


  readonly tours =
    signal<TourResponse[]>([]);

  readonly paquetes =
    signal<PaqueteResponse[]>([]);


  readonly tourSeleccionadoId =
    signal<number | null>(
      null
    );

  readonly paqueteSeleccionadoId =
    signal<number | null>(
      null
    );


  readonly disponibilidadesTour =
    signal<DisponibilidadTourResponse[]>(
      []
    );

  readonly disponibilidadesPaquete =
    signal<DisponibilidadPaqueteResponse[]>(
      []
    );


  readonly loading =
    signal(true);

  readonly loadingDisponibilidades =
    signal(false);

  readonly deletingId =
    signal<number | null>(
      null
    );

  readonly errorMessage =
    signal('');

  readonly actionError =
    signal('');


  ngOnInit(): void {

    this.cargarCatalogos();
  }


  private cargarCatalogos(): void {

    this.loading.set(true);

    this.errorMessage.set('');


    this.tourService
      .listarTodosAdmin()
      .subscribe({

        next: tours => {

          this.tours.set(
            tours
          );


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
        },

        error: error => {

          this.procesarErrorCarga(
            error
          );
        }

      });
  }


  cambiarTipo(
    tipo: TipoDisponibilidad
  ): void {

    this.tipo.set(
      tipo
    );

    this.actionError.set('');
  }


  seleccionarTour(
    tourId: number
  ): void {

    this.tourSeleccionadoId.set(
      tourId
    );

    this.cargarDisponibilidadesTour(
      tourId
    );
  }


  seleccionarPaquete(
    paqueteId: number
  ): void {

    this.paqueteSeleccionadoId.set(
      paqueteId
    );

    this.cargarDisponibilidadesPaquete(
      paqueteId
    );
  }


  cargarDisponibilidadesTour(
    tourId: number
  ): void {

    this.loadingDisponibilidades.set(
      true
    );

    this.errorMessage.set('');


    this.disponibilidadTourService
      .listarPorTour(
        tourId
      )
      .subscribe({

        next: disponibilidades => {

          this.disponibilidadesTour.set(
            disponibilidades
          );

          this.loadingDisponibilidades.set(
            false
          );
        },

        error: error => {

          console.error(
            'Error cargando disponibilidades del tour:',
            error
          );

          this.loadingDisponibilidades.set(
            false
          );

          this.errorMessage.set(
            'No fue posible cargar las disponibilidades del tour.'
          );
        }

      });
  }


  cargarDisponibilidadesPaquete(
    paqueteId: number
  ): void {

    this.loadingDisponibilidades.set(
      true
    );

    this.errorMessage.set('');


    this.disponibilidadPaqueteService
      .listarPorPaquete(
        paqueteId
      )
      .subscribe({

        next: disponibilidades => {

          this.disponibilidadesPaquete.set(
            disponibilidades
          );

          this.loadingDisponibilidades.set(
            false
          );
        },

        error: error => {

          console.error(
            'Error cargando disponibilidades del paquete:',
            error
          );

          this.loadingDisponibilidades.set(
            false
          );

          this.errorMessage.set(
            'No fue posible cargar las disponibilidades del paquete.'
          );
        }

      });
  }



  bloquearTour(
    disponibilidad: DisponibilidadTourResponse
  ): void {

    const confirmado =
      window.confirm(
        `¿Deseas bloquear la disponibilidad del ${disponibilidad.fecha}?`
      );

    if (!confirmado) {
      return;
    }

    this.deletingId.set(
      disponibilidad.id
    );

    this.actionError.set('');

    this.disponibilidadTourService
      .eliminar(
        disponibilidad.id
      )
      .subscribe({

        next: () => {

          this.deletingId.set(null);

          const tourId =
            this.tourSeleccionadoId();

          if (tourId !== null) {

            this.cargarDisponibilidadesTour(
              tourId
            );
          }
        },

        error: error => {

          this.procesarErrorAccion(
            error
          );
        }

      });
  }


  bloquearPaquete(
    disponibilidad: DisponibilidadPaqueteResponse
  ): void {

    const confirmado =
      window.confirm(
        `¿Deseas bloquear la disponibilidad del ${disponibilidad.fecha}?`
      );

    if (!confirmado) {
      return;
    }

    this.deletingId.set(
      disponibilidad.id
    );

    this.actionError.set('');

    this.disponibilidadPaqueteService
      .eliminar(
        disponibilidad.id
      )
      .subscribe({

        next: () => {

          this.deletingId.set(null);

          const paqueteId =
            this.paqueteSeleccionadoId();

          if (paqueteId !== null) {

            this.cargarDisponibilidadesPaquete(
              paqueteId
            );
          }
        },

        error: error => {

          this.procesarErrorAccion(
            error
          );
        }

      });
  }




  private procesarErrorCarga(
    error: any
  ): void {

    console.error(
      'Error cargando catálogos:',
      error
    );

    this.loading.set(false);

    this.errorMessage.set(
      'No fue posible cargar la información.'
    );
  }


  private procesarErrorAccion(
    error: any
  ): void {

    console.error(
      'Error eliminando disponibilidad:',
      error
    );

    this.deletingId.set(
      null
    );

    this.actionError.set(
      error.error?.message ??
      'No fue posible eliminar la disponibilidad.'
    );
  }

} 