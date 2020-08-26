import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaEvaluacionComponent } from './consulta-evaluacion.component';

describe('ConsultaEvaluacionComponent', () => {
  let component: ConsultaEvaluacionComponent;
  let fixture: ComponentFixture<ConsultaEvaluacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaEvaluacionComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
