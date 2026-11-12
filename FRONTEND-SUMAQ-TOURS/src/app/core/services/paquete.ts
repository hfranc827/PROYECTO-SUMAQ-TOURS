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
    CreatePaqueteRequest,
    PaqueteResponse,
    UpdatePaqueteRequest
} from '../../shared/models/paquete.model';


@Injectable({
    providedIn: 'root'
})
export class Paquete {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/paquetes`;


    listarPublicos():
        Observable<PaqueteResponse[]> {

        return this.http.get<PaqueteResponse[]>(
            this.apiUrl
        );
    }


    obtenerPorId(
        id: number
    ): Observable<PaqueteResponse> {

        return this.http.get<PaqueteResponse>(
            `${this.apiUrl}/${id}`
        );
    }


    // =========================
    // ADMIN
    // =========================

    listarTodosAdmin():
        Observable<PaqueteResponse[]> {

        return this.http.get<PaqueteResponse[]>(
            `${this.apiUrl}/admin/todos`
        );
    }


    crear(
        request: CreatePaqueteRequest
    ): Observable<PaqueteResponse> {

        return this.http.post<PaqueteResponse>(
            this.apiUrl,
            request
        );
    }


    actualizar(
        id: number,
        request: UpdatePaqueteRequest
    ): Observable<PaqueteResponse> {

        return this.http.put<PaqueteResponse>(
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