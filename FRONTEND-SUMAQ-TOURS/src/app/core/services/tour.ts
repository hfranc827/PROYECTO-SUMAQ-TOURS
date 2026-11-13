import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

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

    private readonly apiUrl =
        `${environment.apiUrl}/tours`;


    listarPublicos():
        Observable<TourResponse[]> {

        return this.http
            .get<TourResponse[]>(
                this.apiUrl
            );
    }


    obtenerPorId(
        id: number
    ): Observable<TourResponse> {

        return this.http
            .get<TourResponse>(
                `${this.apiUrl}/${id}`
            );
    }


    listarPorDestino(
        destinoId: number
    ): Observable<TourResponse[]> {

        return this.http
            .get<TourResponse[]>(
                `${this.apiUrl}/destino/${destinoId}`
            );
    }


    // ===========================
    // ADMIN
    // ===========================

    listarTodosAdmin():
        Observable<TourResponse[]> {

        return this.http
            .get<TourResponse[]>(
                `${this.apiUrl}/admin/todos`
            );
    }


    crear(
        request: CreateTourRequest
    ): Observable<TourResponse> {

        return this.http
            .post<TourResponse>(
                this.apiUrl,
                request
            );
    }


    actualizar(
        id: number,
        request: UpdateTourRequest
    ): Observable<TourResponse> {

        return this.http
            .put<TourResponse>(
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