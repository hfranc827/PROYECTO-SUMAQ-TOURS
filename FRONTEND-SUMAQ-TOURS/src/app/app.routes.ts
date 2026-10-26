import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

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
        path: 'mi-cuenta',
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            roles: [
                'ROLE_CLIENTE'
            ]
        },
        loadComponent: () =>
            import('./features/client/profile/profile')
                .then(m => m.Profile)
    },

    {
        path: 'admin',
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            roles: [
                'ROLE_ADMIN'
            ]
        },
        loadComponent: () =>
            import('./features/admin/dashboard/dashboard')
                .then(m => m.Dashboard)
    },

    {
        path: 'asesor',
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            roles: [
                'ROLE_ASESOR'
            ]
        },
        loadComponent: () =>
            import('./features/advisor/dashboard/dashboard')
                .then(m => m.Dashboard)
    },
    {
        path: 'destinos',
        loadComponent: () =>
            import('./features/destinos/destino-list/destino-list')
                .then(m => m.DestinoList)
    },

    {
        path: 'asesor/reservas/:id',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_ASESOR']
        },

        loadComponent: () =>
            import(
                './features/advisor/reservation-detail/reservation-detail'
            )
                .then(m => m.ReservationDetail)
    },

    {
        path: 'destinos/:id',
        loadComponent: () =>
            import('./features/destinos/destino-detail/destino-detail')
                .then(m => m.DestinoDetail)
    },
    {
        path: 'tours',
        loadComponent: () =>
            import('./features/tours/tour-list/tour-list')
                .then(m => m.TourList)
    },

    {
        path: 'tours/:id',
        loadComponent: () =>
            import('./features/tours/tour-detail/tour-detail')
                .then(m => m.TourDetail)
    },

    {
        path: 'paquetes',
        loadComponent: () =>
            import(
                './features/paquetes/paquete-list/paquete-list'
            )
                .then(m => m.PaqueteList)
    },

    {
        path: 'paquetes/:id',
        loadComponent: () =>
            import(
                './features/paquetes/paquete-detail/paquete-detail'
            )
                .then(m => m.PaqueteDetail)
    },
    {
        path: 'promociones',
        loadComponent: () =>
            import(
                './features/promociones/promocion-list/promocion-list'
            )
                .then(m => m.PromocionList)
    },

    {
        path: 'promociones/:id',
        loadComponent: () =>
            import(
                './features/promociones/promocion-detail/promocion-detail'
            )
                .then(m => m.PromocionDetail)
    },


    {
        path: 'mi-cuenta/reservas/:id',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_CLIENTE']
        },

        loadComponent: () =>
            import(
                './features/client/reservation-detail/reservation-detail'
            )
                .then(m => m.ReservationDetail)
    },

    {
        path: 'pago/exito',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_CLIENTE']
        },

        loadComponent: () =>
            import(
                './features/payment/payment-success/payment-success'
            )
                .then(m => m.PaymentSuccess)
    },

    {
        path: 'pago/cancelado',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_CLIENTE']
        },

        loadComponent: () =>
            import(
                './features/payment/payment-cancel/payment-cancel'
            )
                .then(m => m.PaymentCancel)
    },



    {
        path: 'admin/reservas/:id',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_ADMIN']
        },

        loadComponent: () =>
            import(
                './features/admin/reservation-detail/reservation-detail'
            )
                .then(m => m.ReservationDetail)
    },

    {
        path: 'admin/destinos',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_ADMIN']
        },

        loadComponent: () =>
            import(
                './features/admin/destinations/destination-list/destination-list'
            )
                .then(
                    m => m.DestinationList
                )
    },


    {
        path: 'admin/destinos/nuevo',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_ADMIN']
        },

        loadComponent: () =>
            import(
                './features/admin/destinations/destination-form/destination-form'
            )
                .then(
                    m => m.DestinationForm
                )
    },

    {
        path: 'admin/destinos/:id/editar',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_ADMIN']
        },

        loadComponent: () =>
            import(
                './features/admin/destinations/destination-form/destination-form'
            )
                .then(
                    m => m.DestinationForm
                )
    },

    {
        path: 'admin/tours',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_ADMIN']
        },

        loadComponent: () =>
            import(
                './features/admin/tours/tour-list/tour-list'
            )
                .then(
                    m => m.TourList
                )
    },

    {
        path: 'admin/tours/nuevo',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_ADMIN']
        },

        loadComponent: () =>
            import(
                './features/admin/tours/tour-form/tour-form'
            )
                .then(
                    m => m.TourForm
                )
    },

    {
        path: 'admin/tours/:id/editar',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_ADMIN']
        },

        loadComponent: () =>
            import(
                './features/admin/tours/tour-form/tour-form'
            )
                .then(
                    m => m.TourForm
                )
    },



    {
        path: 'admin/paquetes',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_ADMIN']
        },

        loadComponent: () =>
            import(
                './features/admin/packages/package-list/package-list'
            )
                .then(
                    m => m.PackageList
                )
    },

    {
        path: 'admin/paquetes/nuevo',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_ADMIN']
        },

        loadComponent: () =>
            import(
                './features/admin/packages/package-form/package-form'
            )
                .then(
                    m => m.PackageForm
                )
    },

    {
        path: 'admin/paquetes/:id/editar',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_ADMIN']
        },

        loadComponent: () =>
            import(
                './features/admin/packages/package-form/package-form'
            )
                .then(
                    m => m.PackageForm
                )
    },

    {
        path: 'admin/disponibilidades',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_ADMIN']
        },

        loadComponent: () =>
            import(
                './features/admin/availability/availability-list/availability-list'
            )
                .then(
                    m => m.AvailabilityList
                )
    },

    {
        path: 'admin/disponibilidades/:tipo/nueva',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_ADMIN']
        },

        loadComponent: () =>
            import(
                './features/admin/availability/availability-form/availability-form'
            )
                .then(
                    m => m.AvailabilityForm
                )
    },

    {
        path: 'admin/disponibilidades/:tipo/:id/editar',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_ADMIN']
        },

        loadComponent: () =>
            import(
                './features/admin/availability/availability-form/availability-form'
            )
                .then(
                    m => m.AvailabilityForm
                )
    },

    {
        path: 'admin/promociones',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_ADMIN']
        },

        loadComponent: () =>
            import(
                './features/admin/promotions/promotion-list/promotion-list'
            )
                .then(
                    m => m.PromotionList
                )
    },

    {
        path: 'admin/promociones/nueva',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_ADMIN']
        },

        loadComponent: () =>
            import(
                './features/admin/promotions/promotion-form/promotion-form'
            )
                .then(
                    m => m.PromotionForm
                )
    },

    {
        path: 'admin/promociones/:id/editar',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_ADMIN']
        },

        loadComponent: () =>
            import(
                './features/admin/promotions/promotion-form/promotion-form'
            )
                .then(
                    m => m.PromotionForm
                )
    },

    {
        path: 'admin/itinerarios',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_ADMIN']
        },

        loadComponent: () =>
            import(
                './features/admin/itineraries/itinerary-list/itinerary-list'
            )
                .then(
                    m => m.ItineraryList
                )
    },

    {
        path: 'admin/itinerarios/nuevo',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_ADMIN']
        },

        loadComponent: () =>
            import(
                './features/admin/itineraries/itinerary-form/itinerary-form'
            )
                .then(
                    m => m.ItineraryForm
                )
    },

    {
        path: 'admin/itinerarios/:id/editar',

        canActivate: [
            authGuard,
            roleGuard
        ],

        data: {
            roles: ['ROLE_ADMIN']
        },

        loadComponent: () =>
            import(
                './features/admin/itineraries/itinerary-form/itinerary-form'
            )
                .then(
                    m => m.ItineraryForm
                )
    },



    {
        path: '**',
        loadComponent: () =>
            import('./features/not-found/not-found')
                .then(m => m.NotFound)
    }
];