import { TestBed } from '@angular/core/testing';

import { EnseignantCourService } from './enseignant-cour.service';

describe('EnseignantCourService', () => {
  let service: EnseignantCourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnseignantCourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
