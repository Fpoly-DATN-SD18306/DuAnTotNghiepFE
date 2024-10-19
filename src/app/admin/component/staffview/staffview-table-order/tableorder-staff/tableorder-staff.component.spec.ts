import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableorderStaffComponent } from './tableorder-staff.component';

describe('TableorderStaffComponent', () => {
  let component: TableorderStaffComponent;
  let fixture: ComponentFixture<TableorderStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableorderStaffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableorderStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
