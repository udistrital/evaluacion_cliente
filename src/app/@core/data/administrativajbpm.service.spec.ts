import { TestBed } from '@angular/core/testing';

import { AdministrativajbpmService } from './administrativajbpm.service';

describe('AdministrativajbpmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdministrativajbpmService = TestBed.get(AdministrativajbpmService);
    expect(service).toBeTruthy();
  });
});
