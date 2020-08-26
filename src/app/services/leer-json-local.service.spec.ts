import { TestBed } from '@angular/core/testing';

import { LeerJsonLocalService } from './leer-json-local.service';

describe('LeerJsonLocalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LeerJsonLocalService = TestBed.get(LeerJsonLocalService);
    expect(service).toBeTruthy();
  });
});
