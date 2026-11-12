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
  Paquete
} from '../../../../core/services/paquete';

import {
  PaqueteResponse
} from '../../../../shared/models/paquete.model';


@Component({
  selector: 'app-package-list',

  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './package-list.html',
  styleUrl: './package-list.scss'
})
export class PackageList
  implements OnInit {

  private readonly paqueteService =
    inject(Paquete);


  readonly paquetes =
    signal<PaqueteResponse[]>([]);

  readonly loading =
    signal(true);

  readonly deletingId =
    signal<number | null>(null);

  readonly errorMessage =
    signal('');

  readonly actionError =
    signal('');


  ngOnInit(): void {

    this.cargarPaquetes();
  }


  cargarPaquetes(): void {

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


  eliminarPaquete(
    paquete: PaqueteResponse
  ): void {

    const confirmado =
      window.confirm(
        `¿Deseas desactivar el paquete "${paquete.nombre}"?`
      );


    if (!confirmado) {
      return;
    }


    this.deletingId.set(
      paquete.id
    );

    this.actionError.set('');


    this.paqueteService
      .eliminar(
        paquete.id
      )
      .subscribe({

        next: () => {

          this.deletingId.set(
            null
          );

          this.cargarPaquetes();
        },

        error: error => {

          console.error(
            'Error desactivando paquete:',
            error
          );

          this.deletingId.set(
            null
          );

          this.actionError.set(
            error.error?.message ??
            'No fue posible desactivar el paquete.'
          );
        }

      });
  }

}