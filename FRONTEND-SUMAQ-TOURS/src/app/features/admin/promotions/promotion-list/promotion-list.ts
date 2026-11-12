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
  Promocion
} from '../../../../core/services/promocion';

import {
  PromocionResponse
} from '../../../../shared/models/promocion.model';


@Component({
  selector: 'app-promotion-list',

  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './promotion-list.html',
  styleUrl: './promotion-list.scss'
})
export class PromotionList
  implements OnInit {

  private readonly promocionService =
    inject(Promocion);


  readonly promociones =
    signal<PromocionResponse[]>([]);

  readonly loading =
    signal(true);

  readonly processingId =
    signal<number | null>(null);

  readonly errorMessage =
    signal('');

  readonly actionError =
    signal('');


  ngOnInit(): void {

    this.cargarPromociones();
  }


  cargarPromociones(): void {

    this.loading.set(true);

    this.errorMessage.set('');


    this.promocionService
      .listarTodas()
      .subscribe({

        next: promociones => {

          this.promociones.set(
            promociones
          );

          this.loading.set(false);
        },

        error: error => {

          console.error(
            'Error cargando promociones:',
            error
          );

          this.loading.set(false);

          this.errorMessage.set(
            'No fue posible cargar las promociones.'
          );
        }

      });
  }


  desactivar(
    promocion: PromocionResponse
  ): void {

    const confirmado =
      window.confirm(
        `¿Deseas desactivar la promoción "${promocion.titulo}"?`
      );


    if (!confirmado) {
      return;
    }


    this.processingId.set(
      promocion.id
    );

    this.actionError.set('');


    this.promocionService
      .desactivar(
        promocion.id
      )
      .subscribe({

        next: () => {

          this.processingId.set(
            null
          );

          this.cargarPromociones();
        },

        error: error => {

          console.error(
            'Error desactivando promoción:',
            error
          );

          this.processingId.set(
            null
          );

          this.actionError.set(
            error.error?.message ??
            'No fue posible desactivar la promoción.'
          );
        }

      });
  }

}