import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromocionList } from './promocion-list';

describe('PromocionList', () => {
  let component: PromocionList;
  let fixture: ComponentFixture<PromocionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromocionList],
    }).compileComponents();

    fixture = TestBed.createComponent(PromocionList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
