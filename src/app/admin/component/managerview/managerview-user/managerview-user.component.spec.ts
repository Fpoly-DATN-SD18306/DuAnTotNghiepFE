import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerviewUserComponent } from './managerview-user.component';

describe('ManagerviewUserComponent', () => {
  let component: ManagerviewUserComponent;
  let fixture: ComponentFixture<ManagerviewUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerviewUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerviewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
