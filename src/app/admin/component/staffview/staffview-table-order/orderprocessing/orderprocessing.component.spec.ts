import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderprocessingComponent } from './orderprocessing.component';

describe('OrderprocessingComponent', () => {
  let component: OrderprocessingComponent;
  let fixture: ComponentFixture<OrderprocessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderprocessingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderprocessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
