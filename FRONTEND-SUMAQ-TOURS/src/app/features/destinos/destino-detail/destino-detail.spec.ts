import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DestinoDetail } from './destino-detail';

describe('DestinoDetail', () => {
  let component: DestinoDetail;
  let fixture: ComponentFixture<DestinoDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinoDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(DestinoDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
