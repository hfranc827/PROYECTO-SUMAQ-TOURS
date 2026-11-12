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
    PagoResponse,
    StripeCheckoutResponse
} from '../../shared/models/pago.model';


@Injectable({
    providedIn: 'root'
})
export class Pago {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        environment.apiUrl;


    crearCheckoutStripe(
        reservaId: number
    ): Observable<StripeCheckoutResponse> {

        return this.http.post<StripeCheckoutResponse>(
            `${this.apiUrl}/pagos/stripe/checkout/${reservaId}`,
            {}
        );
    }


    obtenerPagoPorReserva(
        reservaId: number
    ): Observable<PagoResponse> {

        return this.http.get<PagoResponse>(
            `${this.apiUrl}/reservas/${reservaId}/pago`
        );
    }

}