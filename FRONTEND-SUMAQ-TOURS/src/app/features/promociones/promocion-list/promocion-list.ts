import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

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
  PromocionCard
} from '../../../shared/components/promocion-card/promocion-card';

import {
  PromocionResponse
} from '../../../shared/models/promocion.model';


@Component({
  selector: 'app-promocion-list',

  imports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    PromocionCard
  ],

  templateUrl: './promocion-list.html',
  styleUrl: './promocion-list.scss'
})
export class PromocionList
  implements OnInit {

  private readonly promocionService =
    inject(Promocion);


  readonly promociones =
    signal<PromocionResponse[]>([]);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');


  ngOnInit(): void {

    this.cargarPromociones();
  }


  cargarPromociones(): void {

    this.loading.set(true);

    this.errorMessage.set('');


    this.promocionService
      .listarVigentes()
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

}