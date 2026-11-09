export interface ItinerarioResponse {

    id: number;

    paqueteId: number;

    paqueteNombre: string;

    tourId: number | null;

    tourNombre: string | null;

    dia: number;

    orden: number;

    titulo: string;

    descripcion: string | null;

    horaInicio: string | null;
}


export interface CreateItinerarioRequest {

    paqueteId: number;

    tourId?: number;

    dia: number;

    orden: number;

    titulo: string;

    descripcion?: string;

    horaInicio?: string;
}


export interface UpdateItinerarioRequest {

    tourId?: number;

    dia: number;

    orden: number;

    titulo: string;

    descripcion?: string;

    horaInicio?: string;
}