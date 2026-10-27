import {
    TourResumenResponse
} from './tour.model';

export interface PaqueteImagenResponse {

    id: number;

    url: string;

    orden: number;
}

export interface PaqueteResponse {

    id: number;

    nombre: string;

    descripcion: string;

    precio: number;

    duracionDias: number;

    duracionNoches: number;

    capacidadMaxima: number;

    imagenPrincipalUrl: string | null;

    imagenes: PaqueteImagenResponse[];


    incluye: string | null;

    noIncluye: string | null;

    activo: boolean;

    tours: TourResumenResponse[];

    fechaCreacion: string;

    fechaActualizacion: string;
}


export interface CreatePaqueteRequest {

    nombre: string;

    descripcion: string;

    precio: number;

    duracionDias: number;

    duracionNoches: number;

    capacidadMaxima: number;

    imagenPrincipalUrl?: string;

    incluye?: string;

    noIncluye?: string;

    tourIds: number[];
}


export interface UpdatePaqueteRequest
    extends CreatePaqueteRequest {

    activo: boolean;
}