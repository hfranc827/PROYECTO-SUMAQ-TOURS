
import {
    inject,
    Injectable
} from '@angular/core';

import {
    HttpClient
} from '@angular/common/http';

import {
    Observable,
    of,
    throwError
} from 'rxjs';

import {
    environment
} from '../../../environments/environment';

import {
    DemoData
} from './demo-data';

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

    private readonly demoData =
        inject(DemoData);

    private readonly apiUrl =
        `${environment.apiUrl}/destinos`;


    // =====================================
    // LISTAR DESTINOS PÚBLICOS
    // =====================================

    listarPublicos():
        Observable<DestinoResponse[]> {

        if (environment.useMockData) {

            const destinos =
                this.demoData.listarDestinos()
                    .filter(destino => destino.activo);

            return of(destinos);

        }

        return this.http.get<DestinoResponse[]>(
            this.apiUrl
        );

    }


    // =====================================
    // OBTENER DESTINO POR ID
    // =====================================

    obtenerPorId(
        id: number
    ): Observable<DestinoResponse> {

        if (environment.useMockData) {

            const destino =
                this.demoData.listarDestinos()
                    .find(item =>
                        item.id === id &&
                        item.activo
                    );

            if (!destino) {

                return throwError(() => ({
                    status: 404,
                    message: 'Destino no encontrado'
                }));

            }

            return of(destino);

        }

        return this.http.get<DestinoResponse>(
            `${this.apiUrl}/${id}`
        );

    }


    // =====================================
    // ADMINISTRACIÓN
    // =====================================

    listarTodosAdmin():
        Observable<DestinoResponse[]> {

        return this.http.get<DestinoResponse[]>(
            `${this.apiUrl}/admin/todos`
        );

    }


    crear(
        request: CreateDestinoRequest
    ): Observable<DestinoResponse> {

        return this.http.post<DestinoResponse>(
            this.apiUrl,
            request
        );

    }


    actualizar(
        id: number,
        request: UpdateDestinoRequest
    ): Observable<DestinoResponse> {

        return this.http.put<DestinoResponse>(
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
