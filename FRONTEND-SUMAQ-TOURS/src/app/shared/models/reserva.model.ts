
export type EstadoReserva =
    | 'PENDIENTE'
    | 'CONFIRMADA'
    | 'PAGADA'
    | 'FINALIZADA'
    | 'CANCELADA';


// ===========================
// CREAR RESERVA
// ===========================

export interface CreateReservaRequest {

    disponibilidadTourId?: number;

    disponibilidadPaqueteId?: number;

    cantidadPersonas: number;

}


// ===========================
// ACTUALIZAR ESTADO
// ===========================

export interface UpdateEstadoReservaRequest {

    estado: EstadoReserva;

}


// ===========================
// RESPUESTA DE RESERVA
// ===========================

export interface ReservaResponse {

    id: number;

    clienteId: number;

    clienteNombre: string;

    tipoReserva: string;

    disponibilidadId: number;

    servicioNombre: string;

    fechaServicio: string;

    cantidadPersonas: number;

    precioTotal: number;

    estado: EstadoReserva;

    fechaReserva: string;

    precioBase: number;

    porcentajeDescuento: number;

    montoDescuento: number;

    promocionId: number | null;

    promocionTitulo: string | null;

}
