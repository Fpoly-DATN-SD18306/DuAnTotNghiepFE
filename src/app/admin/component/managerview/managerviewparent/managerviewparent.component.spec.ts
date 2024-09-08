import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerviewparentComponent } from './managerviewparent.component';

describe('ManagerviewparentComponent', () => {
  let component: ManagerviewparentComponent;
  let fixture: ComponentFixture<ManagerviewparentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerviewparentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerviewparentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
