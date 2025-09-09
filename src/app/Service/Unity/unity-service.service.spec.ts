import { TestBed } from '@angular/core/testing';

import { UnityServiceService } from './unity-service.service';

describe('UnityServiceService', () => {
  let service: UnityServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnityServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
