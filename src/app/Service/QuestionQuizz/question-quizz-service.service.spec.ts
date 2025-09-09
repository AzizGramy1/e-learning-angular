import { TestBed } from '@angular/core/testing';

import { QuestionQuizzServiceService } from './question-quizz-service.service';

describe('QuestionQuizzServiceService', () => {
  let service: QuestionQuizzServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionQuizzServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
