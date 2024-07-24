import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioCertificacionesDveTalentoHumanoComponent } from './formulario-certificaciones-dve-talento-humano.component';

describe('FormularioCertificacionesDveTalentoHumanoComponent', () => {
  let component: FormularioCertificacionesDveTalentoHumanoComponent;
  let fixture: ComponentFixture<FormularioCertificacionesDveTalentoHumanoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioCertificacionesDveTalentoHumanoComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioCertificacionesDveTalentoHumanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
