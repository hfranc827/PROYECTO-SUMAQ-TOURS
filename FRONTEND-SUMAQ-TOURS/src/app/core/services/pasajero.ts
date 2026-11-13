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
    CreatePasajeroRequest,
    PasajeroResponse
} from '../../shared/models/pasajero.model';


@Injectable({
    providedIn: 'root'
})
export class Pasajero {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/reservas`;


    listar(
        reservaId: number
    ): Observable<PasajeroResponse[]> {

        return this.http
            .get<PasajeroResponse[]>(
                `${this.apiUrl}/${reservaId}/pasajeros`
            );
    }


    crear(
        reservaId: number,
        request: CreatePasajeroRequest
    ): Observable<PasajeroResponse> {

        return this.http
            .post<PasajeroResponse>(
                `${this.apiUrl}/${reservaId}/pasajeros`,
                request
            );
    }


    actualizar(
        reservaId: number,
        pasajeroId: number,
        request: CreatePasajeroRequest
    ): Observable<PasajeroResponse> {

        return this.http
            .put<PasajeroResponse>(
                `${this.apiUrl}/${reservaId}/pasajeros/${pasajeroId}`,
                request
            );
    }


    eliminar(
        reservaId: number,
        pasajeroId: number
    ): Observable<void> {

        return this.http
            .delete<void>(
                `${this.apiUrl}/${reservaId}/pasajeros/${pasajeroId}`
            );
    }

}