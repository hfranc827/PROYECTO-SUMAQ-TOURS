export type EstadoPago =
    'REGISTRADO' |
    'ANULADO';

export type MetodoPago =
    'EFECTIVO' |
    'TARJETA' |
    'TRANSFERENCIA' |
    'YAPE' |
    'PLIN' |
    'STRIPE';


export interface StripeCheckoutResponse {
    url: string;
}


export interface PagoResponse {

    id: number;

    reservaId: number;

    monto: number;

    metodoPago: MetodoPago;

    referencia: string;

    estado: EstadoPago;

    fechaPago: string;
}