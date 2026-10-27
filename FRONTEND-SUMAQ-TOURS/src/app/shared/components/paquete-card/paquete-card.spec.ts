import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaqueteCard } from './paquete-card';

describe('PaqueteCard', () => {
  let component: PaqueteCard;
  let fixture: ComponentFixture<PaqueteCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaqueteCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PaqueteCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
