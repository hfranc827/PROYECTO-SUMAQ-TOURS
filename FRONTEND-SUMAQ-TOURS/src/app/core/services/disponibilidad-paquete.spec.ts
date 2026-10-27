import { TestBed } from '@angular/core/testing';
import { DisponibilidadPaquete } from './disponibilidad-paquete';

describe('DisponibilidadPaquete', () => {
  let service: DisponibilidadPaquete;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisponibilidadPaquete);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
