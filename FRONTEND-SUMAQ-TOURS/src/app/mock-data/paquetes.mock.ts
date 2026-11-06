
import {
    PaqueteResponse
} from '../shared/models/paquete.model';

export const MOCK_PAQUETES: PaqueteResponse[] = [

    {
        id: 1,
        nombre: 'Cusco Mágico',
        descripcion: 'Disfruta de una experiencia inolvidable recorriendo Cusco, el Valle Sagrado y la impresionante ciudadela de Machu Picchu.',
        precio: 950,
        duracionDias: 4,
        duracionNoches: 3,
        capacidadMaxima: 12,
        imagenPrincipalUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=85',
        imagenes: [
            {
                id: 1,
                url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=85',
                orden: 1
            }
        ],
        incluye: 'Alojamiento, transporte turístico, guía y excursiones programadas.',
        noIncluye: 'Alimentación no especificada y gastos personales.',
        activo: true,
        tours: [
            {
                id: 1,
                nombre: 'Experiencia Machu Picchu',
                destinoNombre: 'Cusco',
                precio: 280
            },
            {
                id: 2,
                nombre: 'Valle Sagrado de los Incas',
                destinoNombre: 'Cusco',
                precio: 160
            }
        ],
        fechaCreacion: '2026-01-10T10:00:00',
        fechaActualizacion: '2026-01-10T10:00:00'
    },

    {
        id: 2,
        nombre: 'Aventura en el Sur Peruano',
        descripcion: 'Explora los paisajes naturales y atractivos culturales de Arequipa en una experiencia diseñada para descubrir el sur del Perú.',
        precio: 780,
        duracionDias: 3,
        duracionNoches: 2,
        capacidadMaxima: 10,
        imagenPrincipalUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
        imagenes: [
            {
                id: 2,
                url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85',
                orden: 1
            }
        ],
        incluye: 'Transporte turístico, guía y actividades programadas.',
        noIncluye: 'Alimentación y gastos personales.',
        activo: true,
        tours: [
            {
                id: 3,
                nombre: 'Aventura en el Cañón del Colca',
                destinoNombre: 'Arequipa',
                precio: 190
            }
        ],
        fechaCreacion: '2026-01-10T10:00:00',
        fechaActualizacion: '2026-01-10T10:00:00'
    },

    {
        id: 3,
        nombre: 'Ica: Desierto y Aventura',
        descripcion: 'Vive una experiencia diferente entre dunas, oasis y paisajes desérticos en uno de los destinos más atractivos del sur peruano.',
        precio: 420,
        duracionDias: 2,
        duracionNoches: 1,
        capacidadMaxima: 15,
        imagenPrincipalUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85',
        imagenes: [
            {
                id: 3,
                url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85',
                orden: 1
            }
        ],
        incluye: 'Transporte turístico y actividad de aventura.',
        noIncluye: 'Alimentación y gastos personales.',
        activo: true,
        tours: [
            {
                id: 4,
                nombre: 'Sandboard y Buggies en Huacachina',
                destinoNombre: 'Ica',
                precio: 90
            }
        ],
        fechaCreacion: '2026-01-10T10:00:00',
        fechaActualizacion: '2026-01-10T10:00:00'
    }

];
