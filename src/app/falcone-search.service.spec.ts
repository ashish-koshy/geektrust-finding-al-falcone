import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FalconeSearchService } from './falcone-search.service';

describe('FalconeService', () => {
  let service: FalconeSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule]
    });
    service = TestBed.inject(FalconeSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
