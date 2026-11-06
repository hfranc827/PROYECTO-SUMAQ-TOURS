
import {
    Injectable,
    inject,
    PLATFORM_ID
} from '@angular/core';

import {
    isPlatformBrowser
} from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class MockStorageService {

    private readonly platformId = inject(PLATFORM_ID);

    private readonly prefix = 'sumaqtours-demo-v1';

    obtenerOCrear<T>(
        clave: string,
        datosIniciales: T[]
    ): T[] {

        if (!isPlatformBrowser(this.platformId)) {
            return datosIniciales;
        }

        const storageKey = `${this.prefix}-${clave}`;

        try {

            const almacenado = localStorage.getItem(storageKey);

            if (almacenado !== null) {

                const datos: unknown = JSON.parse(almacenado);

                if (Array.isArray(datos)) {
                    return datos as T[];
                }

            }

            localStorage.setItem(
                storageKey,
                JSON.stringify(datosIniciales)
            );

        } catch (error) {

            console.warn(
                `No se pudieron recuperar los datos de demostración: ${clave}`,
                error
            );

        }

        return datosIniciales;
    }

    reiniciar(clave: string): void {

        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        localStorage.removeItem(
            `${this.prefix}-${clave}`
        );

    }

    reiniciarTodo(): void {

        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        Object.keys(localStorage)
            .filter(key => key.startsWith(this.prefix))
            .forEach(key => localStorage.removeItem(key));

    }

}
