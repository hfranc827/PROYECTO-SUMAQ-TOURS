export interface DestinoResponse {

    id: number;

    nombre: string;

    descripcion: string;

    ubicacion: string;

    imagenPrincipalUrl: string | null;

    activo: boolean;

    fechaCreacion: string;

    fechaActualizacion: string;
}


export interface CreateDestinoRequest {

    nombre: string;

    descripcion: string;

    ubicacion: string;

    imagenPrincipalUrl?: string | null;
}


export interface UpdateDestinoRequest {

    nombre: string;

    descripcion: string;

    ubicacion: string;

    imagenPrincipalUrl?: string | null;

    activo: boolean;
}