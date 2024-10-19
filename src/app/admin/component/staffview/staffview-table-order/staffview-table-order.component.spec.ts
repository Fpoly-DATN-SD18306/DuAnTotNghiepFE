import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffviewTableOrderComponent } from './staffview-table-order.component';

describe('StaffviewTableOrderComponent', () => {
  let component: StaffviewTableOrderComponent;
  let fixture: ComponentFixture<StaffviewTableOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaffviewTableOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffviewTableOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
