import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
  Destino
} from '../../../core/services/destino';

import {
  DestinoResponse
} from '../../../shared/models/destino.model';


@Component({
  selector: 'app-destino-list',

  imports: [
    RouterLink,
    MatButtonModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './destino-list.html',
  styleUrl: './destino-list.scss'
})
export class DestinoList
  implements OnInit {

  private readonly destinoService =
    inject(Destino);


  readonly destinos =
    signal<DestinoResponse[]>([]);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');


  ngOnInit(): void {

    this.cargarDestinos();
  }


  cargarDestinos(): void {

    this.loading.set(true);

    this.errorMessage.set('');


    this.destinoService
      .listarPublicos()
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

}