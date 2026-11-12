import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
    CreateDisponibilidadTourRequest,
    DisponibilidadTourResponse,
    UpdateDisponibilidadTourRequest
} from '../../shared/models/disponibilidad-tour.model';


@Injectable({
    providedIn: 'root'
})
export class DisponibilidadTour {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/disponibilidades-tours`;


    listarPorTour(
        tourId: number
    ): Observable<DisponibilidadTourResponse[]> {

        return this.http.get<DisponibilidadTourResponse[]>(
            `${this.apiUrl}/tour/${tourId}`
        );
    }


    obtenerPorId(
        id: number
    ): Observable<DisponibilidadTourResponse> {

        return this.http.get<DisponibilidadTourResponse>(
            `${this.apiUrl}/${id}`
        );
    }


    // ===========================
    // ADMIN
    // ===========================

    crear(
        request: CreateDisponibilidadTourRequest
    ): Observable<DisponibilidadTourResponse> {

        return this.http.post<DisponibilidadTourResponse>(
            this.apiUrl,
            request
        );
    }


    actualizar(
        id: number,
        request: UpdateDisponibilidadTourRequest
    ): Observable<DisponibilidadTourResponse> {

        return this.http.put<DisponibilidadTourResponse>(
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