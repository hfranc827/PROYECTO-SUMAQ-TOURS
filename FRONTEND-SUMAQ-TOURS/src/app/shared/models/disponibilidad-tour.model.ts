export type EstadoDisponibilidad =
    'DISPONIBLE' |
    'AGOTADO' |
    'BLOQUEADO';


export interface DisponibilidadTourResponse {

    id: number;

    tourId: number;

    tourNombre: string;

    fecha: string;

    capacidadTotal: number;

    cuposDisponibles: number;

    estado: EstadoDisponibilidad;
}


export interface CreateDisponibilidadTourRequest {

    tourId: number;

    fecha: string;

    capacidadTotal: number;
}


export interface UpdateDisponibilidadTourRequest {

    capacidadTotal: number;

    cuposDisponibles: number;

    estado: EstadoDisponibilidad;
}