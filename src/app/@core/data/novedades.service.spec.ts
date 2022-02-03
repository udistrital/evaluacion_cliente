import { TestBed } from '@angular/core/testing';

import { NovedadesService } from './novedades.service';

describe('NovedadesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NovedadesService = TestBed.get(NovedadesService);
    expect(service).toBeTruthy();
  });
});
