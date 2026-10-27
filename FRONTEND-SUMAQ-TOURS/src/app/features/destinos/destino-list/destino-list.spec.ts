import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DestinoList } from './destino-list';

describe('DestinoList', () => {
  let component: DestinoList;
  let fixture: ComponentFixture<DestinoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinoList],
    }).compileComponents();

    fixture = TestBed.createComponent(DestinoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
