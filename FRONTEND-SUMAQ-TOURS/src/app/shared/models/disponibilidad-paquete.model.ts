import {
    EstadoDisponibilidad
} from './disponibilidad-tour.model';


export interface DisponibilidadPaqueteResponse {

    id: number;

    paqueteId: number;

    paqueteNombre: string;

    fecha: string;

    capacidadTotal: number;

    cuposDisponibles: number;

    estado: EstadoDisponibilidad;
}


export interface CreateDisponibilidadPaqueteRequest {

    paqueteId: number;

    fecha: string;

    capacidadTotal: number;
}


export interface UpdateDisponibilidadPaqueteRequest {

    capacidadTotal: number;

    cuposDisponibles: number;

    estado: EstadoDisponibilidad;
}