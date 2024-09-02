import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestUIAdminComponent } from './test-uiadmin.component';

describe('TestUIAdminComponent', () => {
  let component: TestUIAdminComponent;
  let fixture: ComponentFixture<TestUIAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestUIAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestUIAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
