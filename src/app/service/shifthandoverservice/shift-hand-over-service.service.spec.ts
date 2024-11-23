import { TestBed } from '@angular/core/testing';

import { ShiftHandOverServiceService } from './shift-hand-over-service.service';

describe('ShiftHandOverServiceService', () => {
  let service: ShiftHandOverServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftHandOverServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
