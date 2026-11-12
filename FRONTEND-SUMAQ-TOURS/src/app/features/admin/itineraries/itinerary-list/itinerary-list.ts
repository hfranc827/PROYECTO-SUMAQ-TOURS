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
  Paquete
} from '../../../../core/services/paquete';

import {
  Itinerario
} from '../../../../core/services/itinerario';

import {
  PaqueteResponse
} from '../../../../shared/models/paquete.model';

import {
  ItinerarioResponse
} from '../../../../shared/models/itinerario.model';


@Component({
  selector: 'app-itinerary-list',

  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './itinerary-list.html',
  styleUrl: './itinerary-list.scss'
})
export class ItineraryList
  implements OnInit {

  private readonly paqueteService =
    inject(Paquete);

  private readonly itinerarioService =
    inject(Itinerario);


  readonly paquetes =
    signal<PaqueteResponse[]>([]);

  readonly paqueteSeleccionadoId =
    signal<number | null>(null);

  readonly itinerarios =
    signal<ItinerarioResponse[]>([]);

  readonly loading =
    signal(true);

  readonly loadingItinerarios =
    signal(false);

  readonly deletingId =
    signal<number | null>(null);

  readonly errorMessage =
    signal('');

  readonly actionError =
    signal('');


  ngOnInit(): void {

    this.cargarPaquetes();
  }


  private cargarPaquetes(): void {

    this.loading.set(true);

    this.errorMessage.set('');


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

          console.error(
            'Error cargando paquetes:',
            error
          );

          this.loading.set(false);

          this.errorMessage.set(
            'No fue posible cargar los paquetes.'
          );
        }

      });
  }


  seleccionarPaquete(
    paqueteId: number
  ): void {

    this.paqueteSeleccionadoId.set(
      paqueteId
    );

    this.cargarItinerarios(
      paqueteId
    );
  }


  cargarItinerarios(
    paqueteId: number
  ): void {

    this.loadingItinerarios.set(
      true
    );

    this.errorMessage.set('');


    this.itinerarioService
      .listarPorPaquete(
        paqueteId
      )
      .subscribe({

        next: itinerarios => {

          this.itinerarios.set(
            itinerarios
          );

          this.loadingItinerarios.set(
            false
          );
        },

        error: error => {

          console.error(
            'Error cargando itinerarios:',
            error
          );

          this.loadingItinerarios.set(
            false
          );

          this.errorMessage.set(
            'No fue posible cargar el itinerario.'
          );
        }

      });
  }


  eliminar(
    itinerario: ItinerarioResponse
  ): void {

    const confirmado =
      window.confirm(
        `¿Deseas eliminar la actividad "${itinerario.titulo}"?`
      );


    if (!confirmado) {
      return;
    }


    this.deletingId.set(
      itinerario.id
    );

    this.actionError.set('');


    this.itinerarioService
      .eliminar(
        itinerario.id
      )
      .subscribe({

        next: () => {

          this.deletingId.set(
            null
          );

          const paqueteId =
            this.paqueteSeleccionadoId();


          if (paqueteId !== null) {

            this.cargarItinerarios(
              paqueteId
            );
          }
        },

        error: error => {

          console.error(
            'Error eliminando itinerario:',
            error
          );

          this.deletingId.set(
            null
          );

          this.actionError.set(
            error.error?.message ??
            'No fue posible eliminar la actividad.'
          );
        }

      });
  }

}