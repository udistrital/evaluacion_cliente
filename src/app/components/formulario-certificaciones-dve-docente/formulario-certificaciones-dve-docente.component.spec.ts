import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioCertificacionesDveDocenteComponent } from './formulario-certificaciones-dve-docente.component';

describe('FormularioCertificacionesDveDocenteComponent', () => {
  let component: FormularioCertificacionesDveDocenteComponent;
  let fixture: ComponentFixture<FormularioCertificacionesDveDocenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioCertificacionesDveDocenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioCertificacionesDveDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
