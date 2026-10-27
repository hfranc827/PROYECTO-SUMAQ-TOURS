import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaqueteList } from './paquete-list';

describe('PaqueteList', () => {
  let component: PaqueteList;
  let fixture: ComponentFixture<PaqueteList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaqueteList],
    }).compileComponents();

    fixture = TestBed.createComponent(PaqueteList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
