
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
    CreatePromocionRequest,
    PromocionResponse,
    UpdatePromocionRequest
} from '../../shared/models/promocion.model';

import {
    MockStorageService
} from './mock-storage.service';

import {
    MOCK_PROMOCIONES
} from '../../mock-data/promociones.mock';

@Injectable({
    providedIn: 'root'
})
export class Promocion {

    private readonly http = inject(HttpClient);

    private readonly mockStorage = inject(MockStorageService);

    private readonly apiUrl =
        `${environment.apiUrl}/promociones`;

    private readonly adminUrl =
        `${environment.apiUrl}/admin/promociones`;

    listarVigentes(): Observable<PromocionResponse[]> {

        if (environment.useMockData) {

            const datos = this.mockStorage.obtenerOCrear(
                'promociones',
                MOCK_PROMOCIONES
            );

            const ahora = new Date();

            const hoy = [
                ahora.getFullYear(),
                String(ahora.getMonth() + 1).padStart(2, '0'),
                String(ahora.getDate()).padStart(2, '0')
            ].join('-');

            return of(
                datos.filter(promocion =>
                    promocion.activo &&
                    promocion.fechaInicio <= hoy &&
                    promocion.fechaFin >= hoy
                )
            );

        }

        return this.http.get<PromocionResponse[]>(
            this.apiUrl
        );

    }

    obtenerPorId(
        id: number
    ): Observable<PromocionResponse> {

        if (environment.useMockData) {

            const promocion = this.mockStorage.obtenerOCrear(
                'promociones',
                MOCK_PROMOCIONES
            ).find(item => item.id === id && item.activo);

            return promocion
                ? of(promocion)
                : throwError(() => new Error('Promoción no encontrada'));

        }

        return this.http.get<PromocionResponse>(
            `${this.apiUrl}/${id}`
        );

    }

    // ===========================
    // ADMIN: CONSERVA BACKEND
    // ===========================

    listarTodas(): Observable<PromocionResponse[]> {

        return this.http.get<PromocionResponse[]>(
            this.adminUrl
        );

    }

    crear(
        request: CreatePromocionRequest
    ): Observable<PromocionResponse> {

        return this.http.post<PromocionResponse>(
            this.apiUrl,
            request
        );

    }

    actualizar(
        id: number,
        request: UpdatePromocionRequest
    ): Observable<PromocionResponse> {

        return this.http.put<PromocionResponse>(
            `${this.apiUrl}/${id}`,
            request
        );

    }

    desactivar(
        id: number
    ): Observable<PromocionResponse> {

        return this.http.patch<PromocionResponse>(
            `${this.apiUrl}/${id}/desactivar`,
            {}
        );

    }

}
