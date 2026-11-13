import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
    CreateDestinoRequest,
    DestinoResponse,
    UpdateDestinoRequest
} from '../../shared/models/destino.model';


@Injectable({
    providedIn: 'root'
})
export class Destino {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/destinos`;


    listarPublicos():
        Observable<DestinoResponse[]> {

        return this.http
            .get<DestinoResponse[]>(
                this.apiUrl
            );
    }


    obtenerPorId(
        id: number
    ): Observable<DestinoResponse> {

        return this.http
            .get<DestinoResponse>(
                `${this.apiUrl}/${id}`
            );
    }


    // ===========================
    // ADMIN
    // ===========================
    listarTodosAdmin():
        Observable<DestinoResponse[]> {

        return this.http.get<DestinoResponse[]>(
            `${this.apiUrl}/admin/todos`
        );
    }


    crear(
        request: CreateDestinoRequest
    ): Observable<DestinoResponse> {

        return this.http
            .post<DestinoResponse>(
                this.apiUrl,
                request
            );
    }


    actualizar(
        id: number,
        request: UpdateDestinoRequest
    ): Observable<DestinoResponse> {

        return this.http
            .put<DestinoResponse>(
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