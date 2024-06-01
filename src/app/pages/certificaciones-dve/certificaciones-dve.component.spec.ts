import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificacionesDveComponent } from './certificaciones-dve.component';

describe('CertificacionesDveComponent', () => {
  let component: CertificacionesDveComponent;
  let fixture: ComponentFixture<CertificacionesDveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificacionesDveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificacionesDveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
