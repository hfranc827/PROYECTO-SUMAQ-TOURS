import { inject } from '@angular/core';

import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import {
  catchError,
  switchMap,
  throwError
} from 'rxjs';

import { Router } from '@angular/router';

import { Auth } from '../services/auth';


export const authInterceptor:
  HttpInterceptorFn = (req, next) => {

    const auth =
      inject(Auth);

    const router =
      inject(Router);


    const token =
      auth.getAccessToken();


    const isAuthEndpoint =
      req.url.includes('/api/auth/');


    const requestToSend =
      token && !isAuthEndpoint

        ? req.clone({
          setHeaders: {
            Authorization:
              `Bearer ${token}`
          }
        })

        : req;


    return next(requestToSend)
      .pipe(

        catchError(
          (error: HttpErrorResponse) => {


            if (
              error.status !== 401 ||
              isAuthEndpoint
            ) {

              return throwError(
                () => error
              );
            }


            const refreshToken =
              auth.getRefreshToken();


            if (!refreshToken) {

              auth.limpiarSesion();

              router.navigate([
                '/login'
              ]);

              return throwError(
                () => error
              );
            }


            return auth
              .refreshToken()
              .pipe(

                switchMap(
                  response => {

                    const retryRequest =
                      req.clone({

                        setHeaders: {

                          Authorization:
                            `${response.tokenType} ${response.accessToken}`

                        }

                      });


                    return next(
                      retryRequest
                    );
                  }
                ),


                catchError(
                  refreshError => {

                    auth.limpiarSesion();

                    router.navigate([
                      '/login'
                    ]);

                    return throwError(
                      () => refreshError
                    );
                  }
                )

              );

          }
        )

      );
  };