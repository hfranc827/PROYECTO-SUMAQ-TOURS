import { TestBed } from '@angular/core/testing';
import { Pasajero } from './pasajero';

describe('Pasajero', () => {
  let service: Pasajero;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Pasajero);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
