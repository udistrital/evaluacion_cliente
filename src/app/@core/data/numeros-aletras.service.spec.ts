import { TestBed } from '@angular/core/testing';

import { NumerosAletrasService } from './numeros-aletras.service';

describe('NumerosAletrasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NumerosAletrasService = TestBed.get(NumerosAletrasService);
    expect(service).toBeTruthy();
  });
});
