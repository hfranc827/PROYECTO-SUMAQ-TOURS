
import {
    PromocionResponse
} from '../shared/models/promocion.model';

export const MOCK_PROMOCIONES: PromocionResponse[] = [

    {
        id: 1,
        titulo: 'Descubre Machu Picchu',
        descripcion: 'Aprovecha esta promoción especial y vive una experiencia inolvidable en la ciudadela inca.',
        porcentajeDescuento: 15,
        fechaInicio: '2026-01-01',
        fechaFin: '2027-12-31',
        activo: true,
        tipoProducto: 'TOUR',
        productoId: 1,
        productoNombre: 'Experiencia Machu Picchu'
    },

    {
        id: 2,
        titulo: 'Viaja y descubre Cusco',
        descripcion: 'Disfruta de una tarifa especial para conocer los principales atractivos de Cusco.',
        porcentajeDescuento: 20,
        fechaInicio: '2026-01-01',
        fechaFin: '2027-12-31',
        activo: true,
        tipoProducto: 'PAQUETE',
        productoId: 1,
        productoNombre: 'Cusco Mágico'
    },

    {
        id: 3,
        titulo: 'Aventura en el desierto',
        descripcion: 'Prepárate para vivir una experiencia llena de aventura en las dunas de Ica.',
        porcentajeDescuento: 10,
        fechaInicio: '2026-01-01',
        fechaFin: '2027-12-31',
        activo: true,
        tipoProducto: 'TOUR',
        productoId: 4,
        productoNombre: 'Sandboard y Buggies en Huacachina'
    }

];
