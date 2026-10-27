export interface TourImagenResponse {

    id: number;

    url: string;

    orden: number;
}


export interface TourResponse {

    id: number;

    nombre: string;

    destinoId: number;

    destinoNombre: string;

    descripcion: string;

    precio: number;

    duracionHoras: number;

    capacidadMaxima: number;

    nivelDificultad: NivelDificultad;

    tipoActividad: string;

    imagenPrincipalUrl: string | null;

    imagenes: TourImagenResponse[];

    incluye: string | null;

    noIncluye: string | null;

    activo: boolean;

    fechaCreacion: string;

    fechaActualizacion: string;
}


export interface TourResumenResponse {

    id: number;

    nombre: string;

    destinoNombre: string;

    precio: number;
}

export type NivelDificultad =
    'FACIL' |
    'MODERADO' |
    'DIFICIL';



export interface CreateTourRequest {

    nombre: string;

    destinoId: number;

    descripcion: string;

    precio: number;

    duracionHoras: number;

    capacidadMaxima: number;

    nivelDificultad: NivelDificultad;

    tipoActividad: string;

    imagenPrincipalUrl?: string;

    incluye?: string;

    noIncluye?: string;
}


export interface UpdateTourRequest
    extends CreateTourRequest {

    activo: boolean;
}