import { TestBed } from '@angular/core/testing';
import { ResultGuard } from './result.guard';

describe('RouteGuard', () => {
  let guard: ResultGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ResultGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
