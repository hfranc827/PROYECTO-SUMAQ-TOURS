import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DestinoCard } from './destino-card';

describe('DestinoCard', () => {
  let component: DestinoCard;
  let fixture: ComponentFixture<DestinoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinoCard],
    }).compileComponents();

    fixture = TestBed.createComponent(DestinoCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
