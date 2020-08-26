import { TestBed } from '@angular/core/testing';

import { EvaluacionmidService } from './evaluacionmid.service';

describe('EvaluacionmidService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EvaluacionmidService = TestBed.get(EvaluacionmidService);
    expect(service).toBeTruthy();
  });
});
