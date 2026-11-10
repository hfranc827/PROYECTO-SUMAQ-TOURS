export interface CreatePasajeroRequest {

    nombres: string;

    apellidos: string;

    tipoDocumento: string;

    numeroDocumento: string;

    fechaNacimiento?: string | null;

    nacionalidad?: string | null;
}


export interface PasajeroResponse {

    id: number;

    reservaId: number;

    nombres: string;

    apellidos: string;

    tipoDocumento: string;

    numeroDocumento: string;

    fechaNacimiento: string | null;

    nacionalidad: string | null;
}