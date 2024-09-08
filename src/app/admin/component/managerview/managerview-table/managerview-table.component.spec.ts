import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerviewTableComponent } from './managerview-table.component';

describe('ManagerviewTableComponent', () => {
  let component: ManagerviewTableComponent;
  let fixture: ComponentFixture<ManagerviewTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerviewTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerviewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
