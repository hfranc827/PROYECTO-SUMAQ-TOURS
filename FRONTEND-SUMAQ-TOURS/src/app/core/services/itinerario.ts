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
    CreateItinerarioRequest,
    ItinerarioResponse,
    UpdateItinerarioRequest
} from '../../shared/models/itinerario.model';


@Injectable({
    providedIn: 'root'
})
export class Itinerario {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/itinerarios`;


    listarPorPaquete(
        paqueteId: number
    ): Observable<ItinerarioResponse[]> {

        return this.http
            .get<ItinerarioResponse[]>(
                `${this.apiUrl}/paquete/${paqueteId}`
            );
    }


    obtenerPorId(
        id: number
    ): Observable<ItinerarioResponse> {

        return this.http
            .get<ItinerarioResponse>(
                `${this.apiUrl}/${id}`
            );
    }


    crear(
        request: CreateItinerarioRequest
    ): Observable<ItinerarioResponse> {

        return this.http
            .post<ItinerarioResponse>(
                this.apiUrl,
                request
            );
    }


    actualizar(
        id: number,
        request: UpdateItinerarioRequest
    ): Observable<ItinerarioResponse> {

        return this.http
            .put<ItinerarioResponse>(
                `${this.apiUrl}/${id}`,
                request
            );
    }


    eliminar(
        id: number
    ): Observable<void> {

        return this.http
            .delete<void>(
                `${this.apiUrl}/${id}`
            );
    }

}