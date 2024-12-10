import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInOderDetailComponent } from './product-in-oder-detail.component';

describe('ProductInOderDetailComponent', () => {
  let component: ProductInOderDetailComponent;
  let fixture: ComponentFixture<ProductInOderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductInOderDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductInOderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
