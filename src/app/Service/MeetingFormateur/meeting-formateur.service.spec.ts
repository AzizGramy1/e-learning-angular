import { TestBed } from '@angular/core/testing';

import { MeetingFormateurService } from './meeting-formateur.service';

describe('MeetingFormateurService', () => {
  let service: MeetingFormateurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingFormateurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
