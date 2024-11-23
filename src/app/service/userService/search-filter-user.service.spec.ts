import { TestBed } from '@angular/core/testing';
import { SearchFilterUserService } from './search-filter-user.service';



describe('SearchFilterService', () => {
  let service: SearchFilterUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchFilterUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
