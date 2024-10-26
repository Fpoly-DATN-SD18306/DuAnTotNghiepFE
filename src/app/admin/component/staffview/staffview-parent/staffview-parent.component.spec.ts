import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffviewParentComponent } from './staffview-parent.component';

describe('StaffviewParentComponent', () => {
  let component: StaffviewParentComponent;
  let fixture: ComponentFixture<StaffviewParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaffviewParentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffviewParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
