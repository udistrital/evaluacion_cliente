import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerEvaluacionComponent } from './ver-evaluacion.component';

describe('VerEvaluacionComponent', () => {
  let component: VerEvaluacionComponent;
  let fixture: ComponentFixture<VerEvaluacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerEvaluacionComponent]})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
