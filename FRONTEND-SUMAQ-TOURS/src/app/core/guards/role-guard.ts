import { inject } from '@angular/core';

import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router
} from '@angular/router';

import { Auth } from '../services/auth';

export const roleGuard: CanActivateFn =
  (route: ActivatedRouteSnapshot) => {

    const auth = inject(Auth);
    const router = inject(Router);

    const expectedRoles =
      route.data['roles'] as string[];

    const currentRole =
      auth.getRole();


    if (
      currentRole &&
      expectedRoles.includes(currentRole)
    ) {
      return true;
    }


    return router.createUrlTree([
      '/'
    ]);
  };