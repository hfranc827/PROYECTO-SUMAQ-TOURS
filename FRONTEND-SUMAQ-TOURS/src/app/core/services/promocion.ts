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
    CreatePromocionRequest,
    PromocionResponse,
    UpdatePromocionRequest
} from '../../shared/models/promocion.model';


@Injectable({
    providedIn: 'root'
})
export class Promocion {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/promociones`;

    private readonly adminUrl =
        `${environment.apiUrl}/admin/promociones`;


    listarVigentes():
        Observable<PromocionResponse[]> {

        return this.http
            .get<PromocionResponse[]>(
                this.apiUrl
            );
    }


    obtenerPorId(
        id: number
    ): Observable<PromocionResponse> {

        return this.http
            .get<PromocionResponse>(
                `${this.apiUrl}/${id}`
            );
    }


    // =========================
    // ADMIN
    // =========================

    listarTodas():
        Observable<PromocionResponse[]> {

        return this.http
            .get<PromocionResponse[]>(
                this.adminUrl
            );
    }


    crear(
        request: CreatePromocionRequest
    ): Observable<PromocionResponse> {

        return this.http
            .post<PromocionResponse>(
                this.apiUrl,
                request
            );
    }


    actualizar(
        id: number,
        request: UpdatePromocionRequest
    ): Observable<PromocionResponse> {

        return this.http
            .put<PromocionResponse>(
                `${this.apiUrl}/${id}`,
                request
            );
    }


    desactivar(
        id: number
    ): Observable<PromocionResponse> {

        return this.http
            .patch<PromocionResponse>(
                `${this.apiUrl}/${id}/desactivar`,
                {}
            );
    }

}