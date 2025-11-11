import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavSystem } from './nav-system';

describe('NavSystem', () => {
  let component: NavSystem;
  let fixture: ComponentFixture<NavSystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavSystem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavSystem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
