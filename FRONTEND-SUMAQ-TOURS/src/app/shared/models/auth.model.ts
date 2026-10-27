export interface LoginRequest {
    email: string;
    password: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RegisterRequest {
    nombres: string;
    apellidos: string;
    email: string;
    password: string;
    telefono?: string;
    tipoDocumento?: string;
    numeroDocumento?: string;
}

export interface AuthResponse {
    accessToken: string;
    tokenType: string;
    email: string;
    rol: string;
    refreshToken: string;
}

export interface RegisterResponse {
    usuarioId: number;
    clienteId: number;

    nombres: string;
    apellidos: string;
    email: string;

    rol: string;
    mensaje: string;
}