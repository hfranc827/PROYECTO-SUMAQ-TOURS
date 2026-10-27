import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DestinationForm } from './destination-form';

describe('DestinationForm', () => {
  let component: DestinationForm;
  let fixture: ComponentFixture<DestinationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinationForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DestinationForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
