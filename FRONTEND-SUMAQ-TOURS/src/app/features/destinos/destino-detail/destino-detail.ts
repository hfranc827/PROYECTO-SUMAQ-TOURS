import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  forkJoin
} from 'rxjs';

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
  Tour
} from '../../../core/services/tour';

import {
  DestinoResponse
} from '../../../shared/models/destino.model';

import {
  TourResponse
} from '../../../shared/models/tour.model';

import {
  TourCard
} from '../../../shared/components/tour-card/tour-card';


@Component({
  selector: 'app-destino-detail',

  imports: [
    RouterLink,
    MatButtonModule,
    MatProgressSpinnerModule,
    TourCard
  ],

  templateUrl: './destino-detail.html',
  styleUrl: './destino-detail.scss'
})
export class DestinoDetail
  implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly destinoService =
    inject(Destino);

  private readonly tourService =
    inject(Tour);


  readonly destino =
    signal<DestinoResponse | null>(
      null
    );

  readonly tours =
    signal<TourResponse[]>([]);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');


  ngOnInit(): void {

    const idTexto =
      this.route.snapshot.paramMap
        .get('id');

    const id =
      Number(idTexto);


    if (
      !idTexto ||
      !Number.isInteger(id) ||
      id <= 0
    ) {

      this.router.navigate([
        '/destinos'
      ]);

      return;
    }


    this.cargarDetalle(id);
  }


  private cargarDetalle(
    id: number
  ): void {

    this.loading.set(true);

    this.errorMessage.set('');


    forkJoin({

      destino:
        this.destinoService
          .obtenerPorId(id),

      tours:
        this.tourService
          .listarPorDestino(id)

    })
      .subscribe({

        next: response => {

          this.destino.set(
            response.destino
          );

          this.tours.set(
            response.tours
          );

          this.loading.set(false);
        },

        error: error => {

          console.error(
            'Error cargando detalle del destino:',
            error
          );

          this.loading.set(false);


          if (error.status === 404) {

            this.errorMessage.set(
              'El destino solicitado no existe.'
            );

            return;
          }


          this.errorMessage.set(
            'No fue posible cargar el destino.'
          );
        }

      });
  }

}