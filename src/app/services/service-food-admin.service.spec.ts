import { TestBed } from '@angular/core/testing';

import { ServiceFoodAdminService } from './service-food-admin.service';

describe('ServiceFoodAdminService', () => {
  let service: ServiceFoodAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceFoodAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
