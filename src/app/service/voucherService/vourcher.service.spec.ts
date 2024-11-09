import { TestBed } from '@angular/core/testing';

import { VourcherService } from './vourcher.service';

describe('VourcherService', () => {
  let service: VourcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VourcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
