import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, finalize, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
    AuthResponse,
    LoginRequest,
    RefreshTokenRequest,
    RegisterRequest,
    RegisterResponse
} from '../../shared/models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class Auth {

    private readonly http = inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/auth`;

    private readonly ACCESS_TOKEN_KEY =
        'sumaq_access_token';

    private readonly REFRESH_TOKEN_KEY =
        'sumaq_refresh_token';

    private readonly EMAIL_KEY =
        'sumaq_email';

    private readonly ROLE_KEY =
        'sumaq_role';


    login(
        request: LoginRequest
    ): Observable<AuthResponse> {

        return this.http
            .post<AuthResponse>(
                `${this.apiUrl}/login`,
                request
            )
            .pipe(
                tap(response => {
                    this.guardarSesion(response);
                })
            );
    }


    register(
        request: RegisterRequest
    ): Observable<RegisterResponse> {

        return this.http.post<RegisterResponse>(
            `${this.apiUrl}/register`,
            request
        );
    }


    refreshToken(): Observable<AuthResponse> {

        const refreshToken =
            this.getRefreshToken();

        if (!refreshToken) {
            throw new Error(
                'No existe refresh token'
            );
        }

        const request: RefreshTokenRequest = {
            refreshToken
        };

        return this.http
            .post<AuthResponse>(
                `${this.apiUrl}/refresh`,
                request
            )
            .pipe(
                tap(response => {
                    this.guardarSesion(response);
                })
            );
    }

    logout(): Observable<void> {

        const refreshToken =
            this.getRefreshToken();

        const request: RefreshTokenRequest = {
            refreshToken: refreshToken ?? ''
        };

        return this.http
            .post<void>(
                `${this.apiUrl}/logout`,
                request
            )
            .pipe(
                finalize(() => {
                    this.limpiarSesion();
                })
            );
    }


    guardarSesion(
        response: AuthResponse
    ): void {

        localStorage.setItem(
            this.ACCESS_TOKEN_KEY,
            response.accessToken
        );

        localStorage.setItem(
            this.REFRESH_TOKEN_KEY,
            response.refreshToken
        );

        localStorage.setItem(
            this.EMAIL_KEY,
            response.email
        );

        localStorage.setItem(
            this.ROLE_KEY,
            response.rol
        );
    }


    limpiarSesion(): void {

        localStorage.removeItem(
            this.ACCESS_TOKEN_KEY
        );

        localStorage.removeItem(
            this.REFRESH_TOKEN_KEY
        );

        localStorage.removeItem(
            this.EMAIL_KEY
        );

        localStorage.removeItem(
            this.ROLE_KEY
        );
    }


    getAccessToken(): string | null {

        return localStorage.getItem(
            this.ACCESS_TOKEN_KEY
        );
    }


    getRefreshToken(): string | null {

        return localStorage.getItem(
            this.REFRESH_TOKEN_KEY
        );
    }


    getEmail(): string | null {

        return localStorage.getItem(
            this.EMAIL_KEY
        );
    }


    getRole(): string | null {

        return localStorage.getItem(
            this.ROLE_KEY
        );
    }


    isAuthenticated(): boolean {

        return !!this.getAccessToken();
    }

}