import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductReview } from './product-review';

describe('ProductReview', () => {
  let component: ProductReview;
  let fixture: ComponentFixture<ProductReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductReview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductReview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
