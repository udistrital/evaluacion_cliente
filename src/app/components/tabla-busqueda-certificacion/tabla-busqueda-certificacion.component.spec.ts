import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaBusquedaCertificacionComponent } from './tabla-busqueda-certificacion.component';

describe('TablaBusquedaCertificacionComponent', () => {
  let component: TablaBusquedaCertificacionComponent;
  let fixture: ComponentFixture<TablaBusquedaCertificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaBusquedaCertificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaBusquedaCertificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
