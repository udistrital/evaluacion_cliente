import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormularioCertificacionesDveComponent } from "./formulario-certificaciones-dve.component";

describe("FormularioCertificacionesDveComponent", () => {
  let component: FormularioCertificacionesDveComponent;
  let fixture: ComponentFixture<FormularioCertificacionesDveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormularioCertificacionesDveComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioCertificacionesDveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
