import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileNotFounduserComponent } from './file-not-founduser.component';

describe('FileNotFounduserComponent', () => {
  let component: FileNotFounduserComponent;
  let fixture: ComponentFixture<FileNotFounduserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileNotFounduserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileNotFounduserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
