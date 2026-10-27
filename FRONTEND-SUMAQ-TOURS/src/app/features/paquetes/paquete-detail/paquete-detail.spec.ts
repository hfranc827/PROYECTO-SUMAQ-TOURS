import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaqueteDetail } from './paquete-detail';

describe('PaqueteDetail', () => {
  let component: PaqueteDetail;
  let fixture: ComponentFixture<PaqueteDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaqueteDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(PaqueteDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
