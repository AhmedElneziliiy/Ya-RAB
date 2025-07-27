import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourGuidesComponentComponent } from './tour-guides-component.component';

describe('TourGuidesComponentComponent', () => {
  let component: TourGuidesComponentComponent;
  let fixture: ComponentFixture<TourGuidesComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourGuidesComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourGuidesComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
