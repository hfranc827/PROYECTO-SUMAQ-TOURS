import {
    inject,
    Injectable
} from '@angular/core';

import {
    HttpClient
} from '@angular/common/http';

import {
    Observable
} from 'rxjs';

import {
    environment
} from '../../../environments/environment';

import {
    TourImagenResponse
} from '../../shared/models/tour.model';

import {
    TourImagenRequest
} from '../../shared/models/tour-imagen.model';


@Injectable({
    providedIn: 'root'
})
export class TourImagen {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/tours`;


    listar(
        tourId: number
    ): Observable<TourImagenResponse[]> {

        return this.http
            .get<TourImagenResponse[]>(
                `${this.apiUrl}/${tourId}/imagenes`
            );
    }


    crear(
        tourId: number,
        request: TourImagenRequest
    ): Observable<TourImagenResponse> {

        return this.http
            .post<TourImagenResponse>(
                `${this.apiUrl}/${tourId}/imagenes`,
                request
            );
    }


    actualizar(
        tourId: number,
        imagenId: number,
        request: TourImagenRequest
    ): Observable<TourImagenResponse> {

        return this.http
            .put<TourImagenResponse>(
                `${this.apiUrl}/${tourId}/imagenes/${imagenId}`,
                request
            );
    }


    eliminar(
        tourId: number,
        imagenId: number
    ): Observable<void> {

        return this.http
            .delete<void>(
                `${this.apiUrl}/${tourId}/imagenes/${imagenId}`
            );
    }
}