import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizarEvaluacionComponent } from './realizar-evaluacion.component';

describe('RealizarEvaluacionComponent', () => {
  let component: RealizarEvaluacionComponent;
  let fixture: ComponentFixture<RealizarEvaluacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealizarEvaluacionComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealizarEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
