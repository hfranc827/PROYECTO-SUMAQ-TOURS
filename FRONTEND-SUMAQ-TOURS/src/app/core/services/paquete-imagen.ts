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
    PaqueteImagenResponse
} from '../../shared/models/paquete.model';

import {
    PaqueteImagenRequest
} from '../../shared/models/paquete-imagen.model';


@Injectable({
    providedIn: 'root'
})
export class PaqueteImagen {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/paquetes`;


    listar(
        paqueteId: number
    ): Observable<PaqueteImagenResponse[]> {

        return this.http.get<
            PaqueteImagenResponse[]
        >(
            `${this.apiUrl}/${paqueteId}/imagenes`
        );
    }


    crear(
        paqueteId: number,
        request: PaqueteImagenRequest
    ): Observable<PaqueteImagenResponse> {

        return this.http.post<
            PaqueteImagenResponse
        >(
            `${this.apiUrl}/${paqueteId}/imagenes`,
            request
        );
    }


    actualizar(
        paqueteId: number,
        imagenId: number,
        request: PaqueteImagenRequest
    ): Observable<PaqueteImagenResponse> {

        return this.http.put<
            PaqueteImagenResponse
        >(
            `${this.apiUrl}/${paqueteId}/imagenes/${imagenId}`,
            request
        );
    }


    eliminar(
        paqueteId: number,
        imagenId: number
    ): Observable<void> {

        return this.http.delete<void>(
            `${this.apiUrl}/${paqueteId}/imagenes/${imagenId}`
        );
    }
}