import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerviewReportComponent } from './managerview-report.component';

describe('ManagerviewReportComponent', () => {
  let component: ManagerviewReportComponent;
  let fixture: ComponentFixture<ManagerviewReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerviewReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerviewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
