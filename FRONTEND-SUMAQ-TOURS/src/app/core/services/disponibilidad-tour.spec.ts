import { TestBed } from '@angular/core/testing';
import { DisponibilidadTour } from './disponibilidad-tour';

describe('DisponibilidadTour', () => {
  let service: DisponibilidadTour;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisponibilidadTour);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
