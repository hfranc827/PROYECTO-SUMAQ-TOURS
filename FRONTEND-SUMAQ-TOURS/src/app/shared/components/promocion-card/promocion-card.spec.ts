import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromocionCard } from './promocion-card';

describe('PromocionCard', () => {
  let component: PromocionCard;
  let fixture: ComponentFixture<PromocionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromocionCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PromocionCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
