import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvailabilityList } from './availability-list';

describe('AvailabilityList', () => {
  let component: AvailabilityList;
  let fixture: ComponentFixture<AvailabilityList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilityList],
    }).compileComponents();

    fixture = TestBed.createComponent(AvailabilityList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
