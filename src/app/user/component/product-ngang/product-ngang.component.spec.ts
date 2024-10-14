import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductNgangComponent } from './product-ngang.component';

describe('ProductNgangComponent', () => {
  let component: ProductNgangComponent;
  let fixture: ComponentFixture<ProductNgangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductNgangComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductNgangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
