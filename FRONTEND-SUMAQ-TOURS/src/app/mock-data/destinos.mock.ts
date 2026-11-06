
import {
    DestinoResponse
} from '../shared/models/destino.model';

export const MOCK_DESTINOS: DestinoResponse[] = [

    {
        id: 1,
        nombre: 'Cusco',
        descripcion: 'Descubre la antigua capital del Imperio inca y sus impresionantes atractivos culturales y arqueológicos.',
        ubicacion: 'Cusco, Perú',
        imagenPrincipalUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=85',
        activo: true,
        fechaCreacion: '2026-01-10T10:00:00',
        fechaActualizacion: '2026-01-10T10:00:00'
    },

    {
        id: 2,
        nombre: 'Arequipa',
        descripcion: 'Explora la Ciudad Blanca, sus paisajes volcánicos y la belleza natural del cañón del Colca.',
        ubicacion: 'Arequipa, Perú',
        imagenPrincipalUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
        activo: true,
        fechaCreacion: '2026-01-10T10:00:00',
        fechaActualizacion: '2026-01-10T10:00:00'
    },

    {
        id: 3,
        nombre: 'Puno',
        descripcion: 'Vive una experiencia cultural en el lago Titicaca y conoce las tradiciones de sus comunidades.',
        ubicacion: 'Puno, Perú',
        imagenPrincipalUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85',
        activo: true,
        fechaCreacion: '2026-01-10T10:00:00',
        fechaActualizacion: '2026-01-10T10:00:00'
    },

    {
        id: 4,
        nombre: 'Ica',
        descripcion: 'Disfruta del desierto, las dunas de Huacachina y las experiencias de aventura del sur peruano.',
        ubicacion: 'Ica, Perú',
        imagenPrincipalUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85',
        activo: true,
        fechaCreacion: '2026-01-10T10:00:00',
        fechaActualizacion: '2026-01-10T10:00:00'
    }

];
