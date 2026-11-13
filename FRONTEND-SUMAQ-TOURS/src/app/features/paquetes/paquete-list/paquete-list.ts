import {
  Component,
  computed,
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
  FormsModule
} from '@angular/forms';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
  Paquete
} from '../../../core/services/paquete';

import {
  PaqueteResponse
} from '../../../shared/models/paquete.model';


type FiltroPrecio =
  'TODOS' |
  'MENOR' |
  'MAYOR' |
  'HASTA_300' |
  '300_600' |
  'MAS_600';


@Component({
  selector: 'app-paquete-list',

  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './paquete-list.html',
  styleUrl: './paquete-list.scss'
})
export class PaqueteList
  implements OnInit {

  private readonly paqueteService =
    inject(Paquete);


  readonly paquetes =
    signal<PaqueteResponse[]>([]);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');


  readonly textoBusqueda =
    signal('');

  readonly filtroPrecio =
    signal<FiltroPrecio>(
      'TODOS'
    );


  readonly paquetesFiltrados =
    computed(() => {

      const texto =
        this.textoBusqueda()
          .trim()
          .toLowerCase();

      const filtro =
        this.filtroPrecio();


      let resultado =
        this.paquetes()
          .filter(paquete => {

            if (!texto) {
              return true;
            }


            const coincideNombre =
              paquete.nombre
                .toLowerCase()
                .includes(texto);


            const coincideDescripcion =
              paquete.descripcion
                .toLowerCase()
                .includes(texto);


            const coincideDestino =
              paquete.tours
                .some(tour =>
                  tour.destinoNombre
                    .toLowerCase()
                    .includes(texto)
                );


            return (
              coincideNombre ||
              coincideDescripcion ||
              coincideDestino
            );
          });


      switch (filtro) {

        case 'MENOR':

          resultado =
            [...resultado]
              .sort(
                (a, b) =>
                  a.precio - b.precio
              );

          break;


        case 'MAYOR':

          resultado =
            [...resultado]
              .sort(
                (a, b) =>
                  b.precio - a.precio
              );

          break;


        case 'HASTA_300':

          resultado =
            resultado.filter(
              paquete =>
                paquete.precio <= 300
            );

          break;


        case '300_600':

          resultado =
            resultado.filter(
              paquete =>
                paquete.precio > 300 &&
                paquete.precio <= 600
            );

          break;


        case 'MAS_600':

          resultado =
            resultado.filter(
              paquete =>
                paquete.precio > 600
            );

          break;
      }


      return resultado;
    });


  ngOnInit(): void {

    this.cargarPaquetes();
  }


  cargarPaquetes(): void {

    this.loading.set(true);

    this.errorMessage.set('');


    this.paqueteService
      .listarPublicos()
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
            'No fue posible cargar los paquetes turísticos.'
          );
        }

      });
  }


  actualizarBusqueda(
    valor: string
  ): void {

    this.textoBusqueda.set(
      valor
    );
  }


  actualizarFiltro(
    valor: string
  ): void {

    this.filtroPrecio.set(
      valor as FiltroPrecio
    );
  }

}