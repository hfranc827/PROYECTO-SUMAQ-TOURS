
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
    CreatePaqueteRequest,
    PaqueteResponse,
    UpdatePaqueteRequest
} from '../../shared/models/paquete.model';

import {
    MockStorageService
} from './mock-storage.service';

import {
    MOCK_PAQUETES
} from '../../mock-data/paquetes.mock';

@Injectable({
    providedIn: 'root'
})
export class Paquete {

    private readonly http = inject(HttpClient);

    private readonly mockStorage = inject(MockStorageService);

    private readonly apiUrl =
        `${environment.apiUrl}/paquetes`;

    listarPublicos(): Observable<PaqueteResponse[]> {

        if (environment.useMockData) {

            const datos = this.mockStorage.obtenerOCrear(
                'paquetes',
                MOCK_PAQUETES
            );

            return of(
                datos.filter(paquete => paquete.activo)
            );

        }

        return this.http.get<PaqueteResponse[]>(
            this.apiUrl
        );

    }

    obtenerPorId(
        id: number
    ): Observable<PaqueteResponse> {

        if (environment.useMockData) {

            const paquete = this.mockStorage.obtenerOCrear(
                'paquetes',
                MOCK_PAQUETES
            ).find(item => item.id === id && item.activo);

            return paquete
                ? of(paquete)
                : throwError(() => new Error('Paquete no encontrado'));

        }

        return this.http.get<PaqueteResponse>(
            `${this.apiUrl}/${id}`
        );

    }

    // ===========================
    // ADMIN: CONSERVA BACKEND
    // ===========================

    listarTodosAdmin(): Observable<PaqueteResponse[]> {

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

    eliminar(id: number): Observable<void> {

        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );

    }

}
