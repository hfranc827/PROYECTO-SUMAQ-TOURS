import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./features/home/home')
                .then(m => m.Home)
    },

    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login/login')
                .then(m => m.Login)
    },

    {
        path: 'registro',
        loadComponent: () =>
            import('./features/auth/register/register')
                .then(m => m.Register)
    },

    {
        path: 'nosotros',
        loadComponent: () =>
            import('./features/about/about')
                .then(m => m.About)
    },

    {
        path: 'contacto',
        loadComponent: () =>
            import('./features/contact/contact')
                .then(m => m.Contact)
    },

    {
        path: '**',
        loadComponent: () =>
            import('./features/not-found/not-found')
                .then(m => m.NotFound)
    }
];