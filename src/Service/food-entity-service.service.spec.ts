import { TestBed } from '@angular/core/testing';

import { FoodEntityServiceService } from './food-entity-service.service';

describe('FoodEntityServiceService', () => {
  let service: FoodEntityServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodEntityServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
