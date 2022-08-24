import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConvoySelectionService } from './convoy-selection.service';

describe('ConvoyService', () => {
  let service: ConvoySelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule]
    });
    service = TestBed.inject(ConvoySelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
