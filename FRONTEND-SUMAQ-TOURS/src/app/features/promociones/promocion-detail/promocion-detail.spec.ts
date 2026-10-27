import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromocionDetail } from './promocion-detail';

describe('PromocionDetail', () => {
  let component: PromocionDetail;
  let fixture: ComponentFixture<PromocionDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromocionDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(PromocionDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
