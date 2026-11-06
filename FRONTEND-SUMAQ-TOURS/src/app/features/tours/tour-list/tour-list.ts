
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
    MatButtonModule
} from '@angular/material/button';

import {
    MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
    Tour
} from '../../../core/services/tour';

import {
    TourResponse
} from '../../../shared/models/tour.model';


type FiltroPrecio =
    'TODOS' |
    'MENOR' |
    'MAYOR' |
    'HASTA_150' |
    '150_300' |
    'MAS_300';


@Component({
    selector: 'app-tour-list',

    imports: [
        CommonModule,
        RouterLink,
        MatButtonModule,
        MatProgressSpinnerModule
    ],

    templateUrl: './tour-list.html',
    styleUrl: './tour-list.scss'
})
export class TourList implements OnInit {

    private readonly tourService =
        inject(Tour);


    readonly tours =
        signal<TourResponse[]>([]);


    readonly loading =
        signal(true);


    readonly errorMessage =
        signal('');


    readonly textoBusqueda =
        signal('');


    readonly busquedaAplicada =
        signal('');


    readonly filtroPrecio =
        signal<FiltroPrecio>('TODOS');


    readonly toursFiltrados =
        computed(() => {

            const texto =
                this.busquedaAplicada()
                    .trim()
                    .toLowerCase();

            const filtro =
                this.filtroPrecio();


            let resultado =
                this.tours().filter(tour => {

                    if (!texto) {
                        return true;
                    }

                    return (
                        tour.nombre.toLowerCase().includes(texto) ||
                        tour.destinoNombre.toLowerCase().includes(texto) ||
                        tour.descripcion.toLowerCase().includes(texto) ||
                        tour.tipoActividad.toLowerCase().includes(texto)
                    );

                });


            switch (filtro) {

                case 'MENOR':

                    resultado =
                        [...resultado].sort(
                            (a, b) => a.precio - b.precio
                        );

                    break;


                case 'MAYOR':

                    resultado =
                        [...resultado].sort(
                            (a, b) => b.precio - a.precio
                        );

                    break;


                case 'HASTA_150':

                    resultado =
                        resultado.filter(
                            tour => tour.precio <= 150
                        );

                    break;


                case '150_300':

                    resultado =
                        resultado.filter(
                            tour =>
                                tour.precio > 150 &&
                                tour.precio <= 300
                        );

                    break;


                case 'MAS_300':

                    resultado =
                        resultado.filter(
                            tour => tour.precio > 300
                        );

                    break;

            }

            return resultado;

        });


    ngOnInit(): void {

        this.cargarTours();

    }


    cargarTours(): void {

        this.loading.set(true);

        this.errorMessage.set('');


        this.tourService
            .listarPublicos()
            .subscribe({

                next: tours => {

                    this.tours.set(tours);

                    this.loading.set(false);

                },

                error: error => {

                    console.error(
                        'Error cargando tours:',
                        error
                    );

                    this.loading.set(false);

                    this.errorMessage.set(
                        'No fue posible cargar los tours.'
                    );

                }

            });

    }


    actualizarBusqueda(valor: string): void {

        this.textoBusqueda.set(valor);

    }


    buscar(): void {

        this.busquedaAplicada.set(
            this.textoBusqueda().trim()
        );

    }


    actualizarFiltro(valor: string): void {

        const filtrosValidos: FiltroPrecio[] = [
            'TODOS',
            'MENOR',
            'MAYOR',
            'HASTA_150',
            '150_300',
            'MAS_300'
        ];

        if (
            filtrosValidos.includes(valor as FiltroPrecio)
        ) {

            this.filtroPrecio.set(
                valor as FiltroPrecio
            );

        }

    }

}
