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
} from '../../core/services/destino';

import {
  Tour
} from '../../core/services/tour';

import {
  Paquete
} from '../../core/services/paquete';

import {
  Promocion
} from '../../core/services/promocion';

import {
  DestinoResponse
} from '../../shared/models/destino.model';

import {
  TourResponse
} from '../../shared/models/tour.model';

import {
  PaqueteResponse
} from '../../shared/models/paquete.model';

import {
  PromocionResponse
} from '../../shared/models/promocion.model';

import {
  DestinoCard
} from '../../shared/components/destino-card/destino-card';

import {
  TourCard
} from '../../shared/components/tour-card/tour-card';

import {
  PaqueteCard
} from '../../shared/components/paquete-card/paquete-card';

import {
  PromocionCard
} from '../../shared/components/promocion-card/promocion-card';


@Component({
  selector: 'app-home',

  imports: [
    RouterLink,

    MatButtonModule,
    MatProgressSpinnerModule,

    DestinoCard,
    TourCard,
    PaqueteCard,
    PromocionCard
  ],

  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home
  implements OnInit {

  private readonly destinoService =
    inject(Destino);

  private readonly tourService =
    inject(Tour);

  private readonly paqueteService =
    inject(Paquete);

  private readonly promocionService =
    inject(Promocion);


  readonly destinos =
    signal<DestinoResponse[]>([]);

  readonly tours =
    signal<TourResponse[]>([]);

  readonly paquetes =
    signal<PaqueteResponse[]>([]);

  readonly promociones =
    signal<PromocionResponse[]>([]);


  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');


  ngOnInit(): void {

    this.cargarHome();
  }


  cargarHome(): void {

    this.loading.set(true);

    this.errorMessage.set('');


    forkJoin({

      destinos:
        this.destinoService
          .listarPublicos(),

      tours:
        this.tourService
          .listarPublicos(),

      paquetes:
        this.paqueteService
          .listarPublicos(),

      promociones:
        this.promocionService
          .listarVigentes()

    })
      .subscribe({

        next: response => {

          this.destinos.set(
            response.destinos
              .slice(0, 4)
          );

          this.tours.set(
            response.tours
              .slice(0, 3)
          );

          this.paquetes.set(
            response.paquetes
              .slice(0, 3)
          );

          this.promociones.set(
            response.promociones
              .slice(0, 3)
          );

          this.loading.set(false);
        },

        error: error => {

          console.error(
            'Error cargando Home:',
            error
          );

          this.loading.set(false);

          this.errorMessage.set(
            'No fue posible cargar las experiencias.'
          );
        }

      });
  }

}