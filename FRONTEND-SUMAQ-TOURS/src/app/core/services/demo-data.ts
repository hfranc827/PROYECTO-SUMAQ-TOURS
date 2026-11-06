
import { Injectable } from '@angular/core';

import {
    DestinoResponse
} from '../../shared/models/destino.model';

import {
    TourResponse
} from '../../shared/models/tour.model';


@Injectable({
    providedIn: 'root'
})
export class DemoData {

    private readonly destinosKey =
        'sumaqtours_demo_destinos_v1';

    private readonly toursKey =
        'sumaqtours_demo_tours_v1';


    // =====================================
    // DESTINOS INICIALES
    // =====================================

    private readonly destinosIniciales: DestinoResponse[] = [

        {
            id: 1,
            nombre: 'Cusco',
            descripcion:
                'Descubre la antigua capital del Imperio Inca, sus impresionantes construcciones, paisajes andinos y centros arqueológicos.',
            ubicacion: 'Cusco, Perú',
            imagenPrincipalUrl: null,
            activo: true,
            fechaCreacion: '2026-11-05T08:00:00',
            fechaActualizacion: '2026-11-05T08:00:00'
        },

        {
            id: 2,
            nombre: 'Arequipa',
            descripcion:
                'Explora la Ciudad Blanca, su arquitectura colonial, volcanes y paisajes naturales que hacen de Arequipa un destino especial.',
            ubicacion: 'Arequipa, Perú',
            imagenPrincipalUrl: null,
            activo: true,
            fechaCreacion: '2026-11-05T08:00:00',
            fechaActualizacion: '2026-11-05T08:00:00'
        },

        {
            id: 3,
            nombre: 'Ica',
            descripcion:
                'Disfruta del desierto, el oasis de Huacachina, las playas de Paracas y experiencias de aventura en la costa peruana.',
            ubicacion: 'Ica, Perú',
            imagenPrincipalUrl: null,
            activo: true,
            fechaCreacion: '2026-11-05T08:00:00',
            fechaActualizacion: '2026-11-05T08:00:00'
        },

        {
            id: 4,
            nombre: 'Puno',
            descripcion:
                'Conoce el lago Titicaca, sus islas flotantes y las tradiciones culturales de las comunidades del altiplano peruano.',
            ubicacion: 'Puno, Perú',
            imagenPrincipalUrl: null,
            activo: true,
            fechaCreacion: '2026-11-05T08:00:00',
            fechaActualizacion: '2026-11-05T08:00:00'
        }

    ];


    // =====================================
    // TOURS INICIALES
    // =====================================

    private readonly toursIniciales: TourResponse[] = [

        {
            id: 1,
            nombre: 'Valle Sagrado de los Incas',
            destinoId: 1,
            destinoNombre: 'Cusco',
            descripcion:
                'Recorre los principales atractivos del Valle Sagrado y descubre la historia de las antiguas civilizaciones incas.',
            precio: 180,
            duracionHoras: 8,
            capacidadMaxima: 15,
            nivelDificultad: 'FACIL',
            tipoActividad: 'Cultural',
            imagenPrincipalUrl: null,
            imagenes: [],
            incluye: 'Transporte turístico y guía.',
            noIncluye: 'Alimentación y entradas.',
            activo: true,
            fechaCreacion: '2026-11-05T08:00:00',
            fechaActualizacion: '2026-11-05T08:00:00'
        },

        {
            id: 2,
            nombre: 'City Tour Cusco',
            destinoId: 1,
            destinoNombre: 'Cusco',
            descripcion:
                'Visita los principales atractivos históricos y culturales de la ciudad imperial.',
            precio: 90,
            duracionHoras: 4,
            capacidadMaxima: 20,
            nivelDificultad: 'FACIL',
            tipoActividad: 'Cultural',
            imagenPrincipalUrl: null,
            imagenes: [],
            incluye: 'Guía turístico y transporte.',
            noIncluye: 'Entradas y alimentación.',
            activo: true,
            fechaCreacion: '2026-11-05T08:00:00',
            fechaActualizacion: '2026-11-05T08:00:00'
        },

        {
            id: 3,
            nombre: 'Ruta del Sillar',
            destinoId: 2,
            destinoNombre: 'Arequipa',
            descripcion:
                'Conoce las impresionantes canteras de sillar y las formaciones naturales de Añashuayco.',
            precio: 75,
            duracionHoras: 4,
            capacidadMaxima: 15,
            nivelDificultad: 'FACIL',
            tipoActividad: 'Naturaleza',
            imagenPrincipalUrl: null,
            imagenes: [],
            incluye: 'Transporte y guía turístico.',
            noIncluye: 'Alimentación.',
            activo: true,
            fechaCreacion: '2026-11-05T08:00:00',
            fechaActualizacion: '2026-11-05T08:00:00'
        },

        {
            id: 4,
            nombre: 'Cañón del Colca',
            destinoId: 2,
            destinoNombre: 'Arequipa',
            descripcion:
                'Disfruta de los paisajes del valle del Colca y observa el vuelo del cóndor andino.',
            precio: 150,
            duracionHoras: 12,
            capacidadMaxima: 15,
            nivelDificultad: 'MODERADO',
            tipoActividad: 'Aventura',
            imagenPrincipalUrl: null,
            imagenes: [],
            incluye: 'Transporte y guía.',
            noIncluye: 'Alimentación y entradas.',
            activo: true,
            fechaCreacion: '2026-11-05T08:00:00',
            fechaActualizacion: '2026-11-05T08:00:00'
        },

        {
            id: 5,
            nombre: 'Islas Ballestas',
            destinoId: 3,
            destinoNombre: 'Ica',
            descripcion:
                'Navega por el océano Pacífico y descubre la fauna marina de las Islas Ballestas.',
            precio: 85,
            duracionHoras: 2,
            capacidadMaxima: 20,
            nivelDificultad: 'FACIL',
            tipoActividad: 'Naturaleza',
            imagenPrincipalUrl: null,
            imagenes: [],
            incluye: 'Paseo en lancha y guía.',
            noIncluye: 'Alimentación y traslados terrestres.',
            activo: true,
            fechaCreacion: '2026-11-05T08:00:00',
            fechaActualizacion: '2026-11-05T08:00:00'
        },

        {
            id: 6,
            nombre: 'Oasis de Huacachina',
            destinoId: 3,
            destinoNombre: 'Ica',
            descripcion:
                'Vive una experiencia de aventura entre las dunas del desierto con actividades de tubulares y sandboard.',
            precio: 100,
            duracionHoras: 2,
            capacidadMaxima: 12,
            nivelDificultad: 'MODERADO',
            tipoActividad: 'Aventura',
            imagenPrincipalUrl: null,
            imagenes: [],
            incluye: 'Paseo en tubulares y equipo de sandboard.',
            noIncluye: 'Alimentación.',
            activo: true,
            fechaCreacion: '2026-11-05T08:00:00',
            fechaActualizacion: '2026-11-05T08:00:00'
        },

        {
            id: 7,
            nombre: 'Islas de los Uros',
            destinoId: 4,
            destinoNombre: 'Puno',
            descripcion:
                'Conoce las tradicionales islas flotantes del lago Titicaca y la cultura de sus habitantes.',
            precio: 80,
            duracionHoras: 3,
            capacidadMaxima: 15,
            nivelDificultad: 'FACIL',
            tipoActividad: 'Cultural',
            imagenPrincipalUrl: null,
            imagenes: [],
            incluye: 'Transporte lacustre y guía.',
            noIncluye: 'Alimentación.',
            activo: true,
            fechaCreacion: '2026-11-05T08:00:00',
            fechaActualizacion: '2026-11-05T08:00:00'
        },

        {
            id: 8,
            nombre: 'Isla Taquile',
            destinoId: 4,
            destinoNombre: 'Puno',
            descripcion:
                'Explora la isla Taquile y conoce sus paisajes, costumbres y tradiciones textiles.',
            precio: 120,
            duracionHoras: 8,
            capacidadMaxima: 12,
            nivelDificultad: 'MODERADO',
            tipoActividad: 'Cultural',
            imagenPrincipalUrl: null,
            imagenes: [],
            incluye: 'Transporte lacustre y guía.',
            noIncluye: 'Alimentación.',
            activo: true,
            fechaCreacion: '2026-11-05T08:00:00',
            fechaActualizacion: '2026-11-05T08:00:00'
        }

    ];


    // =====================================
    // CONSULTAR DESTINOS
    // =====================================

    listarDestinos(): DestinoResponse[] {

        return this.leer(
            this.destinosKey,
            this.destinosIniciales
        );

    }


    // =====================================
    // CONSULTAR TOURS
    // =====================================

    listarTours(): TourResponse[] {

        return this.leer(
            this.toursKey,
            this.toursIniciales
        );

    }


    // =====================================
    // PERSISTENCIA
    // =====================================

    guardarDestinos(
        destinos: DestinoResponse[]
    ): void {

        this.guardar(
            this.destinosKey,
            destinos
        );

    }


    guardarTours(
        tours: TourResponse[]
    ): void {

        this.guardar(
            this.toursKey,
            tours
        );

    }


    private leer<T>(
        key: string,
        inicial: T
    ): T {

        if (typeof localStorage === 'undefined') {
            return inicial;
        }

        const guardado = localStorage.getItem(key);

        if (guardado !== null) {

            try {

                return JSON.parse(guardado) as T;

            } catch {

                localStorage.removeItem(key);

            }

        }

        localStorage.setItem(
            key,
            JSON.stringify(inicial)
        );

        return inicial;

    }


    private guardar<T>(
        key: string,
        datos: T
    ): void {

        if (typeof localStorage === 'undefined') {
            return;
        }

        localStorage.setItem(
            key,
            JSON.stringify(datos)
        );

    }

}
