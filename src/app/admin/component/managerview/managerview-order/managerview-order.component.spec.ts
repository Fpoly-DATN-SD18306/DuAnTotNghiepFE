import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerviewOrderComponent } from './managerview-order.component';

describe('ManagerviewOrderComponent', () => {
  let component: ManagerviewOrderComponent;
  let fixture: ComponentFixture<ManagerviewOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerviewOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerviewOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
