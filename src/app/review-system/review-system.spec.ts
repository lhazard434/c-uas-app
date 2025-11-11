import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewSystem } from './review-system';

describe('ReviewSystem', () => {
  let component: ReviewSystem;
  let fixture: ComponentFixture<ReviewSystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewSystem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewSystem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
