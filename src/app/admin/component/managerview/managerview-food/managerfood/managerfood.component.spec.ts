import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerfoodComponent } from './managerfood.component';

describe('ManagerfoodComponent', () => {
  let component: ManagerfoodComponent;
  let fixture: ComponentFixture<ManagerfoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerfoodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerfoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
