import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCertificacionComponent } from './ver-certificacion.component';

describe('VerCertificacionComponent', () => {
  let component: VerCertificacionComponent;
  let fixture: ComponentFixture<VerCertificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerCertificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerCertificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
