import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCertificacionSinNovedadComponent } from './crear-certificacion-sin-novedad.component';

describe('CrearCertificacionSinNovedadComponent', () => {
  let component: CrearCertificacionSinNovedadComponent;
  let fixture: ComponentFixture<CrearCertificacionSinNovedadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearCertificacionSinNovedadComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearCertificacionSinNovedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
