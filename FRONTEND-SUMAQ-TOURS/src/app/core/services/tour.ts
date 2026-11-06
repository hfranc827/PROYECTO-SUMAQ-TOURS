
import {
    inject,
    Injectable
} from '@angular/core';

import {
    HttpClient
} from '@angular/common/http';

import {
    Observable,
    of,
    throwError
} from 'rxjs';

import {
    environment
} from '../../../environments/environment';

import {
    DemoData
} from './demo-data';

import {
    CreateTourRequest,
    TourResponse,
    UpdateTourRequest
} from '../../shared/models/tour.model';


@Injectable({
    providedIn: 'root'
})
export class Tour {

    private readonly http =
        inject(HttpClient);

    private readonly demoData =
        inject(DemoData);

    private readonly apiUrl =
        `${environment.apiUrl}/tours`;


    // =====================================
    // LISTAR TOURS PÚBLICOS
    // =====================================

    listarPublicos():
        Observable<TourResponse[]> {

        if (environment.useMockData) {

            const tours =
                this.demoData.listarTours()
                    .filter(tour => tour.activo);

            return of(tours);

        }

        return this.http.get<TourResponse[]>(
            this.apiUrl
        );

    }


    // =====================================
    // OBTENER TOUR POR ID
    // =====================================

    obtenerPorId(
        id: number
    ): Observable<TourResponse> {

        if (environment.useMockData) {

            const tour =
                this.demoData.listarTours()
                    .find(item =>
                        item.id === id &&
                        item.activo
                    );

            if (!tour) {

                return throwError(() => ({
                    status: 404,
                    message: 'Tour no encontrado'
                }));

            }

            return of(tour);

        }

        return this.http.get<TourResponse>(
            `${this.apiUrl}/${id}`
        );

    }


    // =====================================
    // TOURS POR DESTINO
    // =====================================

    listarPorDestino(
        destinoId: number
    ): Observable<TourResponse[]> {

        if (environment.useMockData) {

            const tours =
                this.demoData.listarTours()
                    .filter(tour =>
                        tour.destinoId === destinoId &&
                        tour.activo
                    );

            return of(tours);

        }

        return this.http.get<TourResponse[]>(
            `${this.apiUrl}/destino/${destinoId}`
        );

    }


    // =====================================
    // ADMINISTRACIÓN
    // =====================================

    listarTodosAdmin():
        Observable<TourResponse[]> {

        return this.http.get<TourResponse[]>(
            `${this.apiUrl}/admin/todos`
        );

    }


    crear(
        request: CreateTourRequest
    ): Observable<TourResponse> {

        return this.http.post<TourResponse>(
            this.apiUrl,
            request
        );

    }


    actualizar(
        id: number,
        request: UpdateTourRequest
    ): Observable<TourResponse> {

        return this.http.put<TourResponse>(
            `${this.apiUrl}/${id}`,
            request
        );

    }


    eliminar(
        id: number
    ): Observable<void> {

        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );

    }

}
