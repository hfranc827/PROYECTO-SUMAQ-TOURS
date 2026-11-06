import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
    CreateReservaRequest,
    ReservaResponse,
    UpdateEstadoReservaRequest
} from '../../shared/models/reserva.model';

@Injectable({
    providedIn: 'root'
})
export class Reserva {

    private readonly http = inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/reservas`;


    listarMisReservas():
        Observable<ReservaResponse[]> {

        return this.http.get<ReservaResponse[]>(
            `${this.apiUrl}/mis-reservas`
        );
    }


    crear(
        request: CreateReservaRequest
    ): Observable<ReservaResponse> {

        return this.http.post<ReservaResponse>(
            this.apiUrl,
            request
        );
    }


    cancelarMiReserva(
        id: number
    ): Observable<ReservaResponse> {

        return this.http.patch<ReservaResponse>(
            `${this.apiUrl}/${id}/cancelar`,
            {}
        );
    }


    listarTodas():
        Observable<ReservaResponse[]> {

        return this.http.get<ReservaResponse[]>(
            this.apiUrl
        );
    }


    obtenerPorId(
        id: number
    ): Observable<ReservaResponse> {

        return this.http.get<ReservaResponse>(
            `${this.apiUrl}/${id}`
        );
    }


    actualizarEstado(
        id: number,
        request: UpdateEstadoReservaRequest
    ): Observable<ReservaResponse> {

        return this.http.patch<ReservaResponse>(
            `${this.apiUrl}/${id}/estado`,
            request
        );
    }

}
