import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerviewVoucherComponent } from './managerview-voucher.component';

describe('ManagerviewVoucherComponent', () => {
  let component: ManagerviewVoucherComponent;
  let fixture: ComponentFixture<ManagerviewVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerviewVoucherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerviewVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
