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
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
  Destino
} from '../../../../core/services/destino';

import {
  DestinoResponse
} from '../../../../shared/models/destino.model';


@Component({
  selector: 'app-destination-list',

  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './destination-list.html',
  styleUrl: './destination-list.scss'
})
export class DestinationList
  implements OnInit {

  private readonly destinoService =
    inject(Destino);


  readonly destinos =
    signal<DestinoResponse[]>([]);

  readonly loading =
    signal(true);

  readonly deletingId =
    signal<number | null>(null);

  readonly errorMessage =
    signal('');

  readonly actionError =
    signal('');


  ngOnInit(): void {

    this.cargarDestinos();
  }


  cargarDestinos(): void {

    this.loading.set(true);

    this.errorMessage.set('');


    this.destinoService
      .listarTodosAdmin()
      .subscribe({

        next: destinos => {

          this.destinos.set(
            destinos
          );

          this.loading.set(false);
        },

        error: error => {

          console.error(
            'Error cargando destinos:',
            error
          );

          this.loading.set(false);

          this.errorMessage.set(
            'No fue posible cargar los destinos.'
          );
        }

      });
  }

  eliminarDestino(
    destino: DestinoResponse
  ): void {

    const confirmado =
      window.confirm(
        `¿Deseas desactivar el destino "${destino.nombre}"?`
      );


    if (!confirmado) {
      return;
    }


    this.deletingId.set(
      destino.id
    );

    this.actionError.set('');


    this.destinoService
      .eliminar(
        destino.id
      )
      .subscribe({

        next: () => {

          this.deletingId.set(
            null
          );

          this.cargarDestinos();
        },

        error: error => {

          console.error(
            'Error eliminando destino:',
            error
          );

          this.deletingId.set(
            null
          );

          this.actionError.set(
            error.error?.message ??
            'No fue posible eliminar el destino.'
          );
        }

      });
  }

}