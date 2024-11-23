import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VnPayComponent } from './vn-pay.component';

describe('VnPayComponent', () => {
  let component: VnPayComponent;
  let fixture: ComponentFixture<VnPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VnPayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VnPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
