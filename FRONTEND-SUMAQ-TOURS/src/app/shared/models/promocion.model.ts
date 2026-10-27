export type TipoProductoPromocion =
    'TOUR' | 'PAQUETE';


export interface PromocionResponse {

    id: number;

    titulo: string;

    descripcion: string | null;

    porcentajeDescuento: number;

    fechaInicio: string;

    fechaFin: string;

    activo: boolean;

    tipoProducto: TipoProductoPromocion;

    productoId: number;

    productoNombre: string;
}


export interface CreatePromocionRequest {

    titulo: string;

    descripcion?: string;

    porcentajeDescuento: number;

    fechaInicio: string;

    fechaFin: string;

    tourId?: number;

    paqueteId?: number;
}


export interface UpdatePromocionRequest {

    titulo: string;

    descripcion?: string;

    porcentajeDescuento: number;

    fechaInicio: string;

    fechaFin: string;

    activo: boolean;

    tourId?: number;

    paqueteId?: number;
}