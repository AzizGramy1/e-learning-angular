import { TestBed } from '@angular/core/testing';

import { RessourceDevoirServiceService } from './ressource-devoir-service.service';

describe('RessourceDevoirServiceService', () => {
  let service: RessourceDevoirServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RessourceDevoirServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
