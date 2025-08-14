import { TestBed } from '@angular/core/testing';

import { EnseignantGuard } from './enseignant.guard';

describe('EnseignantGuard', () => {
  let guard: EnseignantGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EnseignantGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
