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
    CreateDisponibilidadPaqueteRequest,
    DisponibilidadPaqueteResponse,
    UpdateDisponibilidadPaqueteRequest
} from '../../shared/models/disponibilidad-paquete.model';


@Injectable({
    providedIn: 'root'
})
export class DisponibilidadPaquete {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/disponibilidades-paquetes`;


    listarPorPaquete(
        paqueteId: number
    ): Observable<DisponibilidadPaqueteResponse[]> {

        return this.http
            .get<DisponibilidadPaqueteResponse[]>(
                `${this.apiUrl}/paquete/${paqueteId}`
            );
    }


    obtenerPorId(
        id: number
    ): Observable<DisponibilidadPaqueteResponse> {

        return this.http
            .get<DisponibilidadPaqueteResponse>(
                `${this.apiUrl}/${id}`
            );
    }


    // =========================
    // ADMIN
    // =========================

    crear(
        request: CreateDisponibilidadPaqueteRequest
    ): Observable<DisponibilidadPaqueteResponse> {

        return this.http
            .post<DisponibilidadPaqueteResponse>(
                this.apiUrl,
                request
            );
    }


    actualizar(
        id: number,
        request: UpdateDisponibilidadPaqueteRequest
    ): Observable<DisponibilidadPaqueteResponse> {

        return this.http
            .put<DisponibilidadPaqueteResponse>(
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