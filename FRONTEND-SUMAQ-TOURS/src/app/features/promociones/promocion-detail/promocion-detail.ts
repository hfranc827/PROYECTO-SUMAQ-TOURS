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
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
  Promocion
} from '../../../core/services/promocion';

import {
  PromocionResponse
} from '../../../shared/models/promocion.model';


@Component({
  selector: 'app-promocion-detail',

  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './promocion-detail.html',
  styleUrl: './promocion-detail.scss'
})
export class PromocionDetail
  implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly promocionService =
    inject(Promocion);


  readonly promocion =
    signal<PromocionResponse | null>(
      null
    );

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');


  ngOnInit(): void {

    const idTexto =
      this.route.snapshot
        .paramMap
        .get('id');

    const id =
      Number(idTexto);


    if (
      !idTexto ||
      !Number.isInteger(id) ||
      id <= 0
    ) {

      this.router.navigate([
        '/promociones'
      ]);

      return;
    }


    this.cargarPromocion(id);
  }


  private cargarPromocion(
    id: number
  ): void {

    this.loading.set(true);

    this.errorMessage.set('');


    this.promocionService
      .obtenerPorId(id)
      .subscribe({

        next: promocion => {

          this.promocion.set(
            promocion
          );

          this.loading.set(false);
        },

        error: error => {

          console.error(
            'Error cargando promoción:',
            error
          );

          this.loading.set(false);


          if (error.status === 404) {

            this.errorMessage.set(
              'La promoción solicitada no existe.'
            );

            return;
          }


          this.errorMessage.set(
            'No fue posible cargar la promoción.'
          );
        }

      });
  }


  irAlProducto(
    promocion: PromocionResponse
  ): void {

    const ruta =
      promocion.tipoProducto === 'TOUR'
        ? '/tours'
        : '/paquetes';


    this.router.navigate([
      ruta,
      promocion.productoId
    ]);
  }

}