import { TestBed } from '@angular/core/testing';

import { InstructionServiceService } from './instruction-service.service';

describe('InstructionServiceService', () => {
  let service: InstructionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstructionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
