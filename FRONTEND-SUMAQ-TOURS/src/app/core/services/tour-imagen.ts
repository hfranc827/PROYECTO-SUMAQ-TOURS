import { inject, Injectable, Service } from '@angular/core';
import { TourImagenRequest } from '../../shared/models/tour-imagen.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TourImagenResponse } from '../../shared/models/tour.model';

@Injectable({providedIn: 'root'})
export class TourImagen {
  private readonly http = inject(HttpClient);

 crear(
    tourId: number,
    request: TourImagenRequest
  ): Observable<TourImagenResponse> {
    return this.http.post<TourImagenResponse>(
      this.rutaImagenes(tourId),
      request
    );
  }

  actualizar(
    tourId: number,
    id: number,
    request: TourImagenRequest
  ): Observable<TourImagenResponse> {
    return this.http.put<TourImagenResponse>(
      `${this.rutaImagenes(tourId)}/${id}`,
      request
    );
  }

  eliminar(tourId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${this.rutaImagenes(tourId)}/${id}`);
  }

  private rutaImagenes(tourId: number): string {
    return `/api/tours/${tourId}/imagenes`;
  }
}
