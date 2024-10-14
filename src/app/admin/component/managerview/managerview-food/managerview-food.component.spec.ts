import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerviewFoodComponent } from './managerview-food.component';

describe('ManagerviewFoodComponent', () => {
  let component: ManagerviewFoodComponent;
  let fixture: ComponentFixture<ManagerviewFoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerviewFoodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerviewFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
