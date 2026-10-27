import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItineraryForm } from './itinerary-form';

describe('ItineraryForm', () => {
  let component: ItineraryForm;
  let fixture: ComponentFixture<ItineraryForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItineraryForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ItineraryForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
